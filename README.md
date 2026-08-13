# automatize — горящие туры → публикация в VK

Backend на TypeScript/Express: забирает (или мокает) подборки туров, валидирует фильтры через Zod, форматирует посты и публикует их на стену сообщества VK.

Небольшой, но цельный кейс по **автоматизации и интеграциям** рядом с экосистемой TravelHub.

## Возможности

- `GET /health` — проверка живости сервиса
- `GET /tours` — список/фильтр туров (`minPrice`, `maxPrice`, `country`, `city`)
- Публикация в VK через `wall.post`
- Режимы токена для upstream API туров: `bearer` | `token` | `x-api-key` | `raw`
- Fallback на mock-туры, если внешний API пустой/недоступен
- Логирование запросов и общий error handler

## Стек

- Node.js 18+
- Express + TypeScript
- Axios · Zod · dotenv · CORS

## Быстрый старт

```bash
cp .env.example .env
npm install
npm run dev
```

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/tours?maxPrice=80000&country=Turkey"
```

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `PORT` | Порт сервера (по умолчанию `3000`) |
| `TOUR_API_URL` | Upstream API туров |
| `TOUR_API_TOKEN` | Опциональный токен API |
| `TOUR_API_TOKEN_MODE` | `bearer` / `token` / `x-api-key` / `raw` |
| `VK_TOKEN` | Access token VK |
| `VK_GROUP_ID` | ID группы (например `-123456789`) |

Файл `.env` в git не коммитить.

## Структура

```text
src/
  index.ts                 # точка входа
  routes/                  # /tours, publish
  controllers/
  services/                # tourService, vkService
  validation/              # Zod-схемы
  data/mockTours.ts
```

## Скрипты

```bash
npm run dev      # ts-node-dev
npm run build    # tsc → dist/
npm start        # node dist/index.js
```

## Связанные репозитории

Экосистема TravelHub: [`travelhub-v2`](https://github.com/s1kata/travelhub-v2) · [`app`](https://github.com/s1kata/app) · [`microservice`](https://github.com/s1kata/microservice)

## Автор

Ильяс ([s1kata](https://github.com/s1kata)) · fullstack / backend