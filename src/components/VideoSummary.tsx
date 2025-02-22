
import { useState } from "react";
import { getSummary, chatWithVideo } from "@/lib/biligpt";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Network, MessageSquare, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VideoSummaryProps {
  videoId: string;
}

export function VideoSummary({ videoId }: VideoSummaryProps) {
  const { toast } = useToast();
  const language = localStorage.getItem('language') || 'en';
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<[string, string][]>([]);

  const { data: summaryData, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['video-summary', videoId],
    queryFn: () => getSummary(videoId),
    enabled: false,
    meta: {
      onError: (error: Error) => {
        toast({
          title: language === 'zh' ? '错误' : 'Error',
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const { mutate: chat, isLoading: isChatLoading } = useMutation({
    mutationFn: () => chatWithVideo(videoId, question, chatHistory),
    onSuccess: (data) => {
      if (data.answer) {
        setChatHistory(prev => [...prev, [question, data.answer]]);
        setQuestion("");
      }
    },
    onError: (error: Error) => {
      toast({
        title: language === 'zh' ? '错误' : 'Error',
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleChat = () => {
    if (!question.trim()) {
      toast({
        title: language === 'zh' ? '提示' : 'Notice',
        description: language === 'zh' ? '请输入问题' : 'Please enter your question',
        variant: "default",
      });
      return;
    }
    chat();
  };

  if (summaryError) {
    return (
      <Button 
        variant="outline" 
        onClick={() => {
          if (!localStorage.getItem('BILIGPT_API_KEY')) {
            toast({
              title: language === 'zh' ? '需要 API 密钥' : 'API Key Required',
              description: language === 'zh' ? 
                '请在设置中添加 BibiGPT API 密钥' : 
                'Please add your BibiGPT API key in settings',
              variant: "destructive",
            });
            return;
          }
          refetchSummary();
        }}
      >
        {language === 'zh' ? '重试' : 'Retry'}
      </Button>
    );
  }

  if (isSummaryLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!summaryData) {
    return (
      <Button 
        variant="outline"
        className="w-full"
        onClick={() => {
          if (!localStorage.getItem('BILIGPT_API_KEY')) {
            toast({
              title: language === 'zh' ? '需要 API 密钥' : 'API Key Required',
              description: language === 'zh' ? 
                '请在设置中添加 BibiGPT API 密钥' : 
                'Please add your BibiGPT API key in settings',
              variant: "destructive",
            });
            return;
          }
          refetchSummary();
        }}
      >
        {language === 'zh' ? '生成摘要' : 'Generate Summary'}
      </Button>
    );
  }

  const keyPoints = summaryData.summary.split('\n').filter(point => point.trim());
  const mindMap = {
    central: summaryData.detail?.title || '',
    branches: keyPoints.map(point => ({
      text: point,
      children: []
    }))
  };

  return (
    <div className="mt-4">
      <Tabs defaultValue="summary">
        <TabsList className="w-full">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            {language === 'zh' ? '摘要' : 'Summary'}
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            {language === 'zh' ? '思维导图' : 'Mind Map'}
          </TabsTrigger>
          <TabsTrigger value="keypoints" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            {language === 'zh' ? '重点' : 'Key Points'}
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {language === 'zh' ? '对话' : 'Chat'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
            {summaryData.summary}
          </div>
        </TabsContent>
        <TabsContent value="mindmap" className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-bold mb-4 text-center">{mindMap.central}</h3>
            <ul className="space-y-2">
              {mindMap.branches.map((branch, index) => (
                <li key={index} className="pl-4 border-l-2 border-primary">
                  {branch.text}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="keypoints" className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-1 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={language === 'zh' ? '输入你的问题...' : 'Type your question...'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChat();
                  }
                }}
              />
              <Button 
                onClick={handleChat}
                disabled={isChatLoading || !question.trim()}
              >
                {language === 'zh' ? '发送' : 'Send'}
              </Button>
            </div>
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <p className="font-medium">{chat[0]}</p>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-lg">
                    <p>{chat[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
