
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { VideoGrid } from "@/components/VideoGrid";
import { type Video } from "@/lib/youtube";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Video[]>([]);

  useEffect(() => {
    const watchHistory = localStorage.getItem('watchHistory');
    if (watchHistory) {
      setHistory(JSON.parse(watchHistory));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Watch History</h1>
        </div>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Your watch history is empty
          </div>
        ) : (
          <VideoGrid
            videos={history}
            onVideoSelect={(video) => navigate(`/watch/${video.id}`)}
          />
        )}
      </div>
    </div>
  );
}
