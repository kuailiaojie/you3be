
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";

export default function Index() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", searchTerm],
    queryFn: () => searchVideos(searchTerm),
    enabled: !!searchTerm,
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        {!searchTerm && !videos.length ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <SearchBar onSearch={setSearchTerm} />
            <p className="text-muted-foreground mt-4 font-medium">Search for videos to get started</p>
          </div>
        ) : (
          <>
            <SearchBar onSearch={setSearchTerm} />
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
          </>
        )}
      </div>
    </div>
  );
}
