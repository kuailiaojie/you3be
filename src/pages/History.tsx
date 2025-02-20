
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { VideoGrid } from "@/components/VideoGrid";
import { type Video } from "@/lib/youtube";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Array<Video & { watchedAt?: string }>>([]);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    const watchHistory = localStorage.getItem('watchHistory');
    if (watchHistory) {
      setHistory(JSON.parse(watchHistory));
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'en');
    };

    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'zh' ? '观看历史' : 'Watch History'}
          </h1>
        </div>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            {language === 'zh' ? '您的观看历史为空' : 'Your watch history is empty'}
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((video, index) => (
              <div key={`${video.id}-${index}`} className="bg-secondary/50 rounded-lg p-4">
                <div className="mb-2 text-sm text-muted-foreground">
                  {video.watchedAt && formatDistanceToNow(new Date(video.watchedAt), {
                    addSuffix: true,
                    locale: language === 'zh' ? zhCN : undefined
                  })}
                </div>
                <VideoGrid
                  videos={[video]}
                  onVideoSelect={(video) => navigate(`/watch/${video.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
