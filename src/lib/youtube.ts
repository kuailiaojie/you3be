
const getStoredSettings = () => {
  const apiKey = localStorage.getItem('youtubeApiKey') || 'AIzaSyC9bfBP9qbOsHjlqPmX8o2rnxN9XjYkzQU';
  const proxyEnabled = localStorage.getItem('proxyEnabled') === 'true';
  const proxyUrl = localStorage.getItem('proxyUrl') || '';
  return { apiKey, proxyEnabled, proxyUrl };
};

const getProxiedUrl = (url: string) => {
  const { proxyEnabled, proxyUrl } = getStoredSettings();
  if (proxyEnabled && proxyUrl) {
    return `${proxyUrl}/${url}`;
  }
  return url;
};

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
}

export async function searchVideos(query: string): Promise<Video[]> {
  const { apiKey } = getStoredSettings();
  const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=${apiKey}`;
  const url = getProxiedUrl(baseUrl);
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: "Loading...",
    likeCount: "Loading..."
  }));
}

export async function getVideoDetails(videoId: string): Promise<Video> {
  const { apiKey } = getStoredSettings();
  const baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const url = getProxiedUrl(baseUrl);
  
  const response = await fetch(url);
  const data = await response.json();
  const item = data.items[0];
  
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics.viewCount,
    likeCount: item.statistics.likeCount
  };
}
