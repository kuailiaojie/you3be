
import { useQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { VideoGrid } from "@/components/VideoGrid";
import { useNavigate } from "react-router-dom";
import { Crown, Filter } from "lucide-react";
import { useState } from "react";
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
];

const TIME_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

export default function Rankings() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["rankings", category, timeFilter],
    queryFn: () => {
      const query = `trending ${category !== "All" ? category.toLowerCase() : ""}`;
      if (timeFilter !== "all") {
        return searchVideos(`${query} this ${timeFilter}`);
      }
      return searchVideos(query);
    },
  });

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Rankings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
