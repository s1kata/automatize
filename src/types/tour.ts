export interface Tour {
  id: string;
  country: string;
  city: string;
  hotel: string;
  price: number;
  dates: string;
  image: string;
}

export interface PublishResultItem {
  tourId: string;
  success: boolean;
  postId?: number;
  error?: string;
}
