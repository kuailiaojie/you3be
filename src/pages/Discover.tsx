
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { VideoGrid } from "@/components/VideoGrid";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Entertainment",
  "Technology",
  "Cooking",
  "Travel",
  "Fashion",
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Upload Date", value: "date" },
  { label: "View Count", value: "viewCount" },
  { label: "Rating", value: "rating" },
];

export default function Discover() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sortBy, setSortBy] = useState("relevance");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["discover", category, sortBy],
    queryFn: ({ pageParam }) => {
      return searchVideos(
        `${category.toLowerCase()} ${sortBy === "date" ? "this week" : ""}`,
        pageParam as string
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  const allVideos = data?.pages.flatMap(page => page.videos) ?? [];

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Discover</h1>
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <VideoGrid
          videos={allVideos}
          onVideoSelect={(video) => navigate(`/watch/${video.id}`)}
        />
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-4">
          {isFetching && (
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}
