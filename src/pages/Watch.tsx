
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getVideoDetails, type Video } from "@/lib/youtube";

export default function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoDetails(videoId!),
    meta: {
      onSuccess: (video: Video) => {
        // Add to watch history
        const watchHistory = localStorage.getItem('watchHistory');
        let history: Video[] = watchHistory ? JSON.parse(watchHistory) : [];
        // Remove duplicate if exists
        history = history.filter(v => v.id !== video.id);
        // Add to beginning of array
        history.unshift(video);
        // Keep only last 50 videos
        history = history.slice(0, 50);
        localStorage.setItem('watchHistory', JSON.stringify(history));
      }
    }
  });

  if (isLoading || !video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <VideoPlayer 
      video={video} 
      onClose={() => navigate(-1)}
    />
  );
}
