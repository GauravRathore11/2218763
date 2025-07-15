// lib/urlStore.ts
type UrlRecord = {
    longUrl: string;
    createdAt: string;
    expiresAt: string;
    shortcode: string;
    clicks: { timestamp: string; location: string }[];
  };
  
  const urlMap = new Map<string, UrlRecord>();
  
  export function saveUrl(record: UrlRecord) {
    urlMap.set(record.shortcode, record);
  }
  
  export function getUrl(code: string): UrlRecord | undefined {
    return urlMap.get(code);
  }
  
  export function getAllUrls(): UrlRecord[] {
    return Array.from(urlMap.values());
  }
  