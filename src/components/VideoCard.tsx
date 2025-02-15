
import { type Video } from "@/lib/youtube";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-medium line-clamp-2 text-gray-900">{video.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{video.channelTitle}</p>
        <p className="text-sm text-gray-400">
          {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
