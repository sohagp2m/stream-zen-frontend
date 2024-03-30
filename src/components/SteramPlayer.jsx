import { useCallback, useRef, useState } from "react";
import { StartAudio, useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react";
import { CiMaximize1, CiVolumeHigh } from "react-icons/ci";
import { FaRegWindowMinimize } from "react-icons/fa";
import { ConnectionState, Track } from "livekit-client";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

export function StreamPlayer({ streamerIdentity }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoEl = useRef(null);
  const playerEl = useRef(null);

  useTracks(Object.values(Track.Source))
    .filter((track) => track.participant.identity === streamerIdentity)
    .forEach((track) => {
      if (videoEl.current) {
        console.log("object");
        track.publication.track?.attach(videoEl.current);
      }
    });
  const onVolumeChange = useCallback((e) => {
    setMuted(e.target.value === "0");
    setVolume(+e.target.value);
    if (videoEl?.current) {
      videoEl.current.muted = e.target.value === "0";
      videoEl.current.volume = +e.target.value * 0.01;
    }
  }, []);

  const onToggleMute = useCallback(() => {
    setMuted(!muted);
    setVolume(muted ? 50 : 0);
    if (videoEl?.current) {
      videoEl.current.muted = !muted;
      videoEl.current.volume = muted ? 0.5 : 0;
    }
  }, [muted]);

  const onFullScreen = useCallback(() => {
    if (isFullScreen) {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullScreen(false);
    } else if (playerEl?.current) {
      playerEl.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullScreen(true);
    }
  }, [isFullScreen]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="relative flex aspect-video bg-black"
        ref={playerEl}>
        <video
          ref={videoEl}
          height="100%"
          width="100%"
        />
        <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
          <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-t from-neutral-900 px-4">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="text-white"
                    onClick={onToggleMute}>
                    {muted ? (
                      <CiVolumeHigh className="h-6 w-6 hover:scale-110 hover:transition-all" />
                    ) : (
                      <CiVolumeHigh className="h-6 w-6 hover:scale-110 hover:transition-all" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{muted ? "Unmute" : "Mute"}</TooltipContent>
              </Tooltip>
              <input
                type="range"
                onChange={onVolumeChange}
                className="ml-1 h-0.5 w-24 cursor-pointer appearance-none rounded-full bg-white accent-white"
                value={volume}
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="text-white"
                    onClick={onFullScreen}>
                    {isFullScreen ? (
                      <FaRegWindowMinimize className="h-5 w-5 hover:scale-110 hover:transition-all" />
                    ) : (
                      <CiMaximize1 className="h-5 w-5 hover:scale-110 hover:transition-all" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <StartAudio
          label="Click to allow audio playback"
          className="absolute top-0 h-full w-full bg-black bg-opacity-75 text-white"
        />
      </div>
    </TooltipProvider>
  );
}

export default function StreamPlayerWrapper({ streamerIdentity }) {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant("s");
  console.log(participant);
  const tracks = useTracks(Object.values(Track.Source)).filter((track) => track.participant.identity === "s");
  const tr = useTracks();
  console.log(tracks, tr);

  if (connectionState !== ConnectionState.Connected || !participant) {
    return (
      <div className="grid aspect-video items-center justify-center bg-black text-sm uppercase text-black">
        {connectionState === ConnectionState.Connected ? "Stream is offline" : toString(connectionState)}
      </div>
    );
  } else if (tracks.length === 0) {
    return (
      <>
        <div className="flex aspect-video items-center justify-center bg-black text-sm uppercase text-black">
          <div className="flex gap-2">
            <div className="h-4 w-4 rounded-full bg-neutral-400 animate-bounce delay-100" />
            <div className="h-4 w-4 rounded-full bg-neutral-500 animate-bounce delay-200" />
            <div className="h-4 w-4 rounded-full bg-neutral-600 animate-bounce delay-300" />
          </div>
        </div>
      </>
    );
  }

  return <StreamPlayer streamerIdentity={"s"} />;
}
