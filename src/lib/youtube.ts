
const getStoredSettings = () => {
  const apiKey = localStorage.getItem('youtubeApiKey') || '';
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
  commentCount: string;
}

export async function searchVideos(query: string, pageToken?: string): Promise<{videos: Video[], nextPageToken?: string}> {
  if (!query) {
    return { videos: [] };
  }

  const { apiKey } = getStoredSettings();
  
  if (!apiKey) {
    throw new Error('YouTube API key not configured. Please set it in the Settings page.');
  }

  const encodedQuery = encodeURIComponent(query);
  const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodedQuery}&type=video&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  const url = getProxiedUrl(baseUrl);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('YouTube API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch videos');
    }
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data);
      return { videos: [] };
    }
    
    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: "Loading...",
      likeCount: "Loading...",
      commentCount: "Loading..."
    }));

    return {
      videos,
      nextPageToken: data.nextPageToken
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export async function getVideoDetails(videoId: string): Promise<Video> {
  const { apiKey } = getStoredSettings();
  
  if (!apiKey) {
    throw new Error('YouTube API key not configured. Please set it in the Settings page.');
  }
  
  const baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const url = getProxiedUrl(baseUrl);
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch video details');
  }
  
  const item = data.items[0];
  
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics.viewCount,
    likeCount: item.statistics.likeCount,
    commentCount: item.statistics.commentCount
  };
}
