
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchVideos, type Video } from "@/lib/youtube";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";
import { VideoPlayer } from "@/components/VideoPlayer";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", searchTerm],
    queryFn: () => searchVideos(searchTerm),
    enabled: !!searchTerm,
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <SearchBar onSearch={setSearchTerm} />
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searchTerm ? (
          <VideoGrid videos={videos} onVideoSelect={setSelectedVideo} />
        ) : (
          <div className="text-center text-gray-500">
            <p>Search for videos to get started</p>
          </div>
        )}
      </div>
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
