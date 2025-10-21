import { Play, Pause, Maximize2, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg object-contain bg-black"
        src={videoUrl}
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-[#FBC888] transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={toggleMute}
              className="hover:text-[#FBC888] transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <span className="text-sm font-medium">{title}</span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="hover:text-[#FBC888] transition-colors"
          >
            <Maximize2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
