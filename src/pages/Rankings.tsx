
import { useQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { VideoGrid } from "@/components/VideoGrid";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";

export default function Rankings() {
  const navigate = useNavigate();
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["rankings"],
    queryFn: () => searchVideos("trending music"),
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Rankings</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <VideoGrid
            videos={videos}
            onVideoSelect={(video) => navigate(`/watch/${video.id}`)}
          />
        )}
      </div>
    </div>
  );
}
