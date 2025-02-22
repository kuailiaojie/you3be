
import { type Video } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { ThumbsUp, MessageCircle, Share2, Save, X } from "lucide-react";
import { VideoSummary } from "@/components/VideoSummary";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const language = localStorage.getItem('language') || 'en';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <button
          onClick={onClose}
          className="ml-auto p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg">
          <div className="bg-[#1A1F2C] rounded-t-lg">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h1 className="text-xl font-bold text-white/90">{video.title}</h1>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/80 text-sm">
                      {formatNumber(Number(video.viewCount))} 
                      {language === 'zh' ? '观看' : ' views'}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm">{formatNumber(Number(video.likeCount))}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{formatNumber(Number(video.commentCount))}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{language === 'zh' ? '分享' : 'Share'}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <Save className="w-5 h-5" />
                      <span className="text-sm">{language === 'zh' ? '收藏' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <VideoSummary videoId={video.id} />
            </div>
          </div>
          <div className="bg-[#221F26] rounded-b-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/90 font-medium">
                    {video.channelTitle}
                  </span>
                </div>
                <p className="text-white/70 text-sm whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
