
import { useQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { VideoGrid } from "@/components/VideoGrid";
import { useNavigate } from "react-router-dom";

const DISCOVER_CATEGORIES = ["Music", "Gaming", "News", "Sports", "Education"];

export default function Discover() {
  const navigate = useNavigate();
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["discover"],
    queryFn: () => searchVideos(DISCOVER_CATEGORIES[Math.floor(Math.random() * DISCOVER_CATEGORIES.length)]),
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-foreground mb-8">Discover</h1>
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
