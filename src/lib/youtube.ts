
const YOUTUBE_API_KEY = 'AIzaSyC9bfBP9qbOsHjlqPmX8o2rnxN9XjYkzQU'; // 这是一个演示用的公开API密钥

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
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
  );
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
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
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
