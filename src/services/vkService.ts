import axios from 'axios';

const VK_API = 'https://api.vk.com/method/wall.post';
const VK_API_VERSION = '5.131';

export interface VkPostSuccess {
  postId: number;
}

export interface VkPostFailure {
  error: string;
  vkErrorCode?: number;
}

function getEnv(): { token: string; groupId: string } {
  const token = process.env.VK_TOKEN ?? '';
  const groupId = process.env.VK_GROUP_ID ?? '';
  return { token, groupId };
}

/** Публикация поста на стене группы VK. Токен не уходит клиенту. */
export async function postToGroupWall(message: string): Promise<VkPostSuccess | VkPostFailure> {
  const { token, groupId } = getEnv();

  if (!token || !groupId) {
    const err = 'Не заданы VK_TOKEN или VK_GROUP_ID';
    console.error('[vkService]', err);
    return { error: err };
  }

  const ownerId = Number(groupId);
  if (Number.isNaN(ownerId)) {
    const err = 'VK_GROUP_ID должен быть числом (например -123456789)';
    console.error('[vkService]', err);
    return { error: err };
  }

  try {
    const params = new URLSearchParams({
      owner_id: String(ownerId),
      from_group: '1',
      message,
      access_token: token,
      v: VK_API_VERSION,
    });

    const { data } = await axios.post<unknown>(VK_API, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 20000,
      validateStatus: () => true,
    });

    type VkJson = {
      response?: { post_id: number };
      error?: { error_code: number; error_msg: string };
    };

    let json: VkJson;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      json = data as VkJson;
    } else if (typeof data === 'string') {
      try {
        json = JSON.parse(data) as VkJson;
      } catch {
        console.error('[vkService] Некорректный JSON ответ:', data.slice(0, 500));
        return { error: 'Некорректный ответ API VK' };
      }
    } else {
      console.error('[vkService] Неожиданный ответ:', data);
      return { error: 'Некорректный ответ API VK' };
    }

    if (json.response?.post_id != null) {
      const postId = json.response.post_id;
      console.log('[vkService] wall.post успешно, post_id:', postId);
      return { postId };
    }

    if (json.error) {
      const { error_code, error_msg } = json.error;
      console.error('[vkService] Ошибка VK API:', error_code, error_msg);
      return { error: error_msg, vkErrorCode: error_code };
    }

    console.error('[vkService] Неожиданный ответ:', json);
    return { error: 'Неожиданный ответ API VK' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[vkService] Запрос не выполнен:', msg);
    return { error: msg };
  }
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Случайная задержка между min и max (мс) — снижает риск лимитов VK */
export function randomDelayBetween(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delayMs(ms);
}
