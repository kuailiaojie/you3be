
import { type Video } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { X } from "lucide-react";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <button
          onClick={onClose}
          className="ml-auto p-2 text-white hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-lg shadow-xl">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>{video.channelTitle}</span>
              <span>{formatNumber(Number(video.viewCount))} views</span>
              <span>{formatNumber(Number(video.likeCount))} likes</span>
            </div>
            <p className="mt-4 text-gray-700 whitespace-pre-line">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
