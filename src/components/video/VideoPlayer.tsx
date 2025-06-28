'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ videoId, onProgress, onComplete }: VideoPlayerProps) {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }
        const data = await response.json();
        setVideoData(data.video);
      } catch (error) {
        toast.error('Error loading video');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  if (loading) {
    return (
      <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-red-500">Failed to load video</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <div style={{padding:'56.25% 0 0 0', position:'relative'}}>
          <iframe 
            src={`https://player.vimeo.com/video/${videoData.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}
            title={videoData.title}
          />
        </div>
        <script src="https://player.vimeo.com/api/player.js" async></script>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{videoData.title}</h2>
        <p className="text-gray-600">{videoData.description}</p>
        <p className="text-sm text-gray-500">Day {videoData.dayNumber}</p>
      </div>
    </div>
  );
}