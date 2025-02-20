
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState("auto");
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [youtubeApiKey, setYoutubeApiKey] = useState(() => localStorage.getItem('youtubeApiKey') || '');
  const [proxyEnabled, setProxyEnabled] = useState(() => localStorage.getItem('proxyEnabled') === 'true');
  const [proxyUrl, setProxyUrl] = useState(() => localStorage.getItem('proxyUrl') || '');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSaveSettings = () => {
    localStorage.setItem('youtubeApiKey', youtubeApiKey);
    localStorage.setItem('proxyEnabled', String(proxyEnabled));
    localStorage.setItem('proxyUrl', proxyUrl);
    localStorage.setItem('darkMode', String(darkMode));
    localStorage.setItem('language', language);
    
    toast({
      title: language === 'zh' ? "设置已保存" : "Settings saved",
      description: language === 'zh' ? "您的偏好设置已成功保存。" : "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          {language === 'zh' ? '设置' : 'Settings'}
        </h1>
        <div className="space-y-8 bg-secondary/50 p-6 rounded-lg backdrop-blur-sm">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {language === 'zh' ? '显示设置' : 'Display Settings'}
            </h2>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-foreground font-medium">
                {language === 'zh' ? '语言' : 'Language'}
              </Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="zh">简体中文</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="dark-mode" className="text-foreground font-medium">
                {language === 'zh' ? '深色模式' : 'Dark Mode'}
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="autoplay" className="text-foreground font-medium">
                {language === 'zh' ? '自动播放' : 'Autoplay'}
              </Label>
              <Switch
                id="autoplay"
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-foreground font-medium">
                {language === 'zh' ? '视频质量' : 'Video Quality'}
              </Label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="auto">{language === 'zh' ? '自动' : 'Auto'}</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {language === 'zh' ? 'API 设置' : 'API Settings'}
            </h2>
            <div className="space-y-2">
              <Label htmlFor="youtube-api" className="text-foreground font-medium">
                {language === 'zh' ? 'YouTube Data API 密钥' : 'YouTube Data API Key'}
              </Label>
              <Input
                id="youtube-api"
                type="text"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder={language === 'zh' ? '输入您的 YouTube Data API 密钥' : 'Enter your YouTube Data API key'}
                className="w-full bg-background text-foreground placeholder:text-muted-foreground font-medium"
              />
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? '您可以从 ' : 'You can get your API key from the '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  {language === 'zh' ? 'Google Cloud 控制台' : 'Google Cloud Console'}
                </a>
                {language === 'zh' ? ' 获取 API 密钥' : ''}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {language === 'zh' ? '代理设置' : 'Proxy Settings'}
            </h2>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="proxy-enabled" className="text-foreground font-medium">
                {language === 'zh' ? '启用全局代理' : 'Enable Global Proxy'}
              </Label>
              <Switch
                id="proxy-enabled"
                checked={proxyEnabled}
                onCheckedChange={setProxyEnabled}
              />
            </div>
            {proxyEnabled && (
              <div className="space-y-2">
                <Label htmlFor="proxy-url" className="text-foreground font-medium">
                  {language === 'zh' ? '代理 URL' : 'Proxy URL'}
                </Label>
                <Input
                  id="proxy-url"
                  type="text"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  placeholder={language === 'zh' ? '输入代理 URL（例如：https://your-proxy.com）' : 'Enter proxy URL (e.g., https://your-proxy.com)'}
                  className="w-full bg-background text-foreground placeholder:text-muted-foreground font-medium"
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'zh' ? '所有外部资源将通过此 URL 代理' : 'All external resources will be proxied through this URL'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {language === 'zh' ? '保存设置' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
