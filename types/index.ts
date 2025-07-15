// types/index.ts
export type UrlInput = {
    longUrl: string;
    validityMinutes?: number;
    shortcode?: string;
  };
  
  export type ShortUrlResponse = {
    shortUrl: string;
    expiryTime: string;
  };
  