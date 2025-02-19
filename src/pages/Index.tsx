
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { SearchBar } from "@/components/SearchBar";
import { VideoGrid } from "@/components/VideoGrid";
import { useToast } from "@/components/ui/use-toast";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Entertainment",
  "Technology",
  "Cooking",
];

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["videos", searchTerm, category],
    queryFn: () => {
      const query = searchTerm ? 
        `${searchTerm} ${category !== "All" ? category.toLowerCase() : ""}` :
        category !== "All" ? category.toLowerCase() : "";
      return searchVideos(query);
    },
    enabled: !!(searchTerm || category !== "All"),
    meta: {
      onError: (err: Error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    }
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className={`${(!searchTerm && !videos.length) ? 'flex flex-col items-center justify-center min-h-[80vh]' : ''}`}>
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchTerm} />
            <div className="flex items-center gap-2 mt-4 mb-8">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!searchTerm && !videos.length ? (
            <p className="text-muted-foreground mt-4 font-medium">Search for videos to get started</p>
          ) : (
            isLoading ? (
              <div className="flex justify-center my-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-muted-foreground mt-8">
                Please check your API key in settings and try again
              </div>
            ) : (
              <VideoGrid
                videos={videos}
                onVideoSelect={(video) => navigate(`/watch/${video.id}`)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
