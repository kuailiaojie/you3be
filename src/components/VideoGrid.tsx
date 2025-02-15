
import { type Video } from "@/lib/youtube";
import { VideoCard } from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export function VideoGrid({ videos, onVideoSelect }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => onVideoSelect(video)}
        />
      ))}
    </div>
  );
}
