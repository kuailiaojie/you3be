
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchVideos } from "@/lib/youtube";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Shorts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLIFrameElement }>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    queryFn: ({ pageParam }) => searchVideos("shorts reels vertical", pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: null
  });

  const allVideos = data?.pages.flatMap(page => page.videos) ?? [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStart = 0;
    let touchEnd = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      touchEnd = e.touches[0].clientY;
      // 阻止默认的滚动行为
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const swipeDistance = touchStart - touchEnd;
      const threshold = 50; // 调整滑动阈值

      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && currentIndex < allVideos.length - 1) {
          // 向上滑动
          setCurrentIndex(prev => prev + 1);
        } else if (swipeDistance < 0 && currentIndex > 0) {
          // 向下滑动
          setCurrentIndex(prev => prev - 1);
        }
      }
      
      isDragging = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, allVideos.length]);

  useEffect(() => {
    if (currentIndex >= allVideos.length - 2 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [currentIndex, allVideos.length, hasNextPage, isFetching, fetchNextPage]);

  if (!allVideos.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black touch-none overflow-hidden md:pl-16"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full"
        >
          <iframe
            ref={el => el && (videoRefs.current[currentIndex] = el)}
            src={`https://www.youtube.com/embed/${allVideos[currentIndex]?.id}?autoplay=1&controls=0&loop=1&modestbranding=1&playsinline=1&rel=0`}
            className="w-full h-full pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-x-0 top-4 flex justify-center">
            {currentIndex > 0 && (
              <ChevronUp className="w-6 h-6 text-white animate-bounce" />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            {currentIndex < allVideos.length - 1 && (
              <ChevronDown className="w-6 h-6 text-white animate-bounce" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
