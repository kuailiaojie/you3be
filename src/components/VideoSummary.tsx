
import { useState } from "react";
import { getSummary } from "@/lib/biligpt";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Network, MessageSquare, Lightbulb } from "lucide-react";

interface VideoSummaryProps {
  videoId: string;
}

export function VideoSummary({ videoId }: VideoSummaryProps) {
  const { toast } = useToast();
  const language = localStorage.getItem('language') || 'en';

  const { data, isLoading, error } = useQuery({
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

  if (error) {
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
        }}
      >
        {language === 'zh' ? '重试' : 'Retry'}
      </Button>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
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
        }}
      >
        {language === 'zh' ? '生成摘要' : 'Generate Summary'}
      </Button>
    );
  }

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
            {data.summary}
          </div>
        </TabsContent>
        <TabsContent value="mindmap" className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            {language === 'zh' ? '思维导图功能即将推出' : 'Mind map feature coming soon'}
          </div>
        </TabsContent>
        <TabsContent value="keypoints" className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            {language === 'zh' ? '重点功能即将推出' : 'Key points feature coming soon'}
          </div>
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            {language === 'zh' ? '对话功能即将推出' : 'Chat feature coming soon'}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
