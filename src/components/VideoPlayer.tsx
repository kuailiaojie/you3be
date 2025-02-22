
import { type Video } from "@/lib/youtube";
import { formatNumber } from "@/lib/utils";
import { ThumbsUp, MessageCircle, Share2, Save, X, List, Lightbulb, MessageSquare, Network } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

interface BiliGptResponse {
  success: boolean;
  summary: string;
  detail: {
    summary: string;
    keyPoints?: string[];
    mindMap?: string;
    conversation?: string;
  };
}

interface BiliGptRequest {
  url: string;
  includeDetail: boolean;
  promptConfig: {
    model: string;
    outputLanguage: string;
    showEmoji: boolean;
    detailLevel: number;
    sentenceNumber: number;
  };
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const language = localStorage.getItem('language') || 'en';
  const [gptData, setGptData] = useState<BiliGptResponse['detail']>({
    summary: '',
    keyPoints: [],
    mindMap: '',
    conversation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBiliGptData = async () => {
    setIsLoading(true);
    try {
      const requestData: BiliGptRequest = {
        url: `https://www.youtube.com/watch?v=${video.id}`,
        includeDetail: true,
        promptConfig: {
          model: "gpt-3.5-turbo",
          outputLanguage: language === 'zh' ? 'zh-CN' : 'en',
          showEmoji: true,
          detailLevel: 2,
          sentenceNumber: 5
        }
      };

      const response = await fetch(`https://api.bibigpt.co/api/open2/${localStorage.getItem('BILIGPT_API_KEY')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data: BiliGptResponse = await response.json();

      if (data.success) {
        setGptData(data.detail);
      } else {
        throw new Error('Failed to analyze video');
      }
    } catch (error) {
      toast({
        title: language === 'zh' ? "获取数据失败" : "Failed to fetch data",
        description: language === 'zh' ? "请检查API密钥是否正确" : "Please check your API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <button
          onClick={onClose}
          className="ml-auto p-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg">
          <div className="bg-[#1A1F2C] rounded-t-lg">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h1 className="text-xl font-bold text-white/90">{video.title}</h1>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/80 text-sm">
                      {formatNumber(Number(video.viewCount))} 
                      {language === 'zh' ? '观看' : ' views'}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm">{formatNumber(Number(video.likeCount))}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{formatNumber(Number(video.commentCount))}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{language === 'zh' ? '分享' : 'Share'}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-[#9b87f5] transition-colors">
                      <Save className="w-5 h-5" />
                      <span className="text-sm">{language === 'zh' ? '收藏' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#221F26] rounded-b-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/90 font-medium">
                    {video.channelTitle}
                  </span>
                </div>
                <p className="text-white/70 text-sm whitespace-pre-line mb-4">
                  {video.description}
                </p>
                
                <div className="mt-6 border-t border-white/10 pt-4">
                  <Button
                    onClick={fetchBiliGptData}
                    disabled={isLoading}
                    className="mb-4 bg-[#9b87f5] hover:bg-[#8b77e5]"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    ) : null}
                    {language === 'zh' ? '使用 BiliGPT 分析' : 'Analyze with BiliGPT'}
                  </Button>

                  {(gptData.summary || gptData.keyPoints || gptData.mindMap || gptData.conversation) && (
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="summary">
                          <List className="w-4 h-4 mr-2" />
                          {language === 'zh' ? '摘要' : 'Summary'}
                        </TabsTrigger>
                        <TabsTrigger value="keyPoints">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {language === 'zh' ? '重点' : 'Key Points'}
                        </TabsTrigger>
                        <TabsTrigger value="mindMap">
                          <Network className="w-4 h-4 mr-2" />
                          {language === 'zh' ? '导图' : 'Mind Map'}
                        </TabsTrigger>
                        <TabsTrigger value="conversation">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {language === 'zh' ? '对话' : 'Dialogue'}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="text-white/80">
                        {gptData.summary || (language === 'zh' ? '暂无摘要' : 'No summary available')}
                      </TabsContent>

                      <TabsContent value="keyPoints">
                        {gptData.keyPoints?.length ? (
                          <ul className="list-disc list-inside text-white/80 space-y-2">
                            {gptData.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-white/80">
                            {language === 'zh' ? '暂无重点' : 'No key points available'}
                          </p>
                        )}
                      </TabsContent>

                      <TabsContent value="mindMap" className="text-white/80">
                        {gptData.mindMap || (language === 'zh' ? '暂无导图' : 'No mind map available')}
                      </TabsContent>

                      <TabsContent value="conversation" className="text-white/80">
                        {gptData.conversation || (language === 'zh' ? '暂无对话' : 'No dialogue available')}
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

