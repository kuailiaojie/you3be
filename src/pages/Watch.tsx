
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVideoDetails, type Video } from "@/lib/youtube";

export default function Watch() {
  const { videoId = "" } = useParams();
  
  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoDetails(videoId),
    enabled: !!videoId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <div className="aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span>{video.channelTitle}</span>
          <span>{video.viewCount} views</span>
          <span>{video.likeCount} likes</span>
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-line">
          {video.description}
        </p>
      </div>
    </div>
  );
}
