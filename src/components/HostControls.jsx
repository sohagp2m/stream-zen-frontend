import { ControlBar, useLocalParticipant, useParticipants } from "@livekit/components-react";
import { Track, createLocalTracks } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import JoinMember from "./JoinMember";
import { FaRegEye } from "react-icons/fa6";

export default function HostControls({ identity }) {
  const [videoTrack, setVideoTrack] = useState();
  const [audioTrack, setAudioTrack] = useState();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const previewVideoEl = useRef(null);
  const joinParticipant = useParticipants();

  const { localParticipant } = useLocalParticipant();

  const createTracks = async () => {
    const tracks = await createLocalTracks({ audio: true, video: true });
    tracks.forEach((track) => {
      switch (track.kind) {
        case "video": {
          if (previewVideoEl?.current) {
            track.attach(previewVideoEl.current);
          }
          setVideoTrack(track);
          break;
        }
        case "audio": {
          setAudioTrack(track);
          break;
        }
      }
    });
  };

  useEffect(() => {
    createTracks();
  }, []);

  useEffect(() => {
    return () => {
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, [videoTrack, audioTrack]);

  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
      setIsUnpublishing(true);

      if (videoTrack) {
        localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        localParticipant.unpublishTrack(audioTrack);
      }

      await createTracks();

      setTimeout(() => {
        setIsUnpublishing(false);
      }, 2000);
    } else if (localParticipant) {
      if (videoTrack) {
        localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        localParticipant.publishTrack(audioTrack);
      }
    }

    setIsPublishing((prev) => !prev);
  }, [audioTrack, isPublishing, localParticipant, videoTrack]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-[5px] text-lg font-bold">
          {isPublishing && !isUnpublishing ? (
            <div className="flex items-center gap-1">
              <span className="relative mr-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
              LIVE
            </div>
          ) : (
            <>
              <Link
                to={"/"}
                className="text-blue-800 font-bold">
                Home /{" "}
              </Link>
              Ready to Stream
            </>
          )}{" "}
        </div>
        <div className="flex gap-2">
          {isPublishing ? (
            <button
              className="secondary-btn"
              onClick={() => togglePublishing()}
              disabled={isUnpublishing}>
              {isUnpublishing ? "Stopping..." : "Stop stream"}
            </button>
          ) : (
            <button
              onClick={() => togglePublishing()}
              className="animate-pulse primary-btn">
              Start stream
            </button>
          )}
        </div>
      </div>
      <div className="aspect-video ring-2 ring-green-500 relative rounded-sm border bg-neutral-800">
        <video
          ref={previewVideoEl}
          width="100%"
          muted
          height="100%"
        />
        {isPublishing && !isUnpublishing ? (
          <p className="flex  absolute top-3 left-4 z-50 items-center font-bold gap-2 text-2xl text-blue-800">
            <span>
              <FaRegEye />
            </span>
            <span>{joinParticipant?.length}</span>
          </p>
        ) : null}{" "}
      </div>
      <div className="flex justify-between px-4  w-full ">
        <p className="">Meeting ID # {identity}</p>
        {isPublishing && !isUnpublishing ? <JoinMember member={joinParticipant} /> : null}
      </div>{" "}
    </div>
  );
}
