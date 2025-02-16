
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
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pl-16">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>
        <div className="space-y-8 bg-secondary/50 p-6 rounded-lg backdrop-blur-sm">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Display Settings</h2>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="dark-mode" className="text-foreground font-medium">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="autoplay" className="text-foreground font-medium">Autoplay</Label>
              <Switch
                id="autoplay"
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-foreground font-medium">Video Quality</Label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">API Settings</h2>
            <div className="space-y-2">
              <Label htmlFor="youtube-api" className="text-foreground font-medium">YouTube Data API Key</Label>
              <Input
                id="youtube-api"
                type="text"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="Enter your YouTube Data API key"
                className="w-full bg-background text-foreground placeholder:text-muted-foreground font-medium"
              />
              <p className="text-sm text-muted-foreground">
                You can get your API key from the{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Proxy Settings</h2>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <Label htmlFor="proxy-enabled" className="text-foreground font-medium">Enable Global Proxy</Label>
              <Switch
                id="proxy-enabled"
                checked={proxyEnabled}
                onCheckedChange={setProxyEnabled}
              />
            </div>
            {proxyEnabled && (
              <div className="space-y-2">
                <Label htmlFor="proxy-url" className="text-foreground font-medium">Proxy URL</Label>
                <Input
                  id="proxy-url"
                  type="text"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  placeholder="Enter proxy URL (e.g., https://your-proxy.com)"
                  className="w-full bg-background text-foreground placeholder:text-muted-foreground font-medium"
                />
                <p className="text-sm text-muted-foreground">
                  All external resources will be proxied through this URL
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
