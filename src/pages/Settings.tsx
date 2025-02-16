
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState("auto");
  const [youtubeApiKey, setYoutubeApiKey] = useState(() => localStorage.getItem('youtubeApiKey') || '');
  const [proxyEnabled, setProxyEnabled] = useState(() => localStorage.getItem('proxyEnabled') === 'true');
  const [proxyUrl, setProxyUrl] = useState(() => localStorage.getItem('proxyUrl') || '');

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('youtubeApiKey', youtubeApiKey);
    localStorage.setItem('proxyEnabled', String(proxyEnabled));
    localStorage.setItem('proxyUrl', proxyUrl);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Display Settings</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay" className="text-foreground">Autoplay</Label>
              <Switch
                id="autoplay"
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-foreground">Video Quality</Label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              <Label htmlFor="youtube-api" className="text-foreground">YouTube Data API Key</Label>
              <Input
                id="youtube-api"
                type="text"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="Enter your YouTube Data API key"
                className="w-full bg-secondary text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                You can get your API key from the{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Proxy Settings</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="proxy-enabled" className="text-foreground">Enable Global Proxy</Label>
              <Switch
                id="proxy-enabled"
                checked={proxyEnabled}
                onCheckedChange={setProxyEnabled}
              />
            </div>
            {proxyEnabled && (
              <div className="space-y-2">
                <Label htmlFor="proxy-url" className="text-foreground">Proxy URL</Label>
                <Input
                  id="proxy-url"
                  type="text"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  placeholder="Enter proxy URL (e.g., https://your-proxy.com)"
                  className="w-full bg-secondary text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  All external resources will be proxied through this URL
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
