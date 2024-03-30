import { useState, useEffect } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useRoomContext,
  useTracks,
  VideoConference,
  FocusLayout,
  formatChatMessageLinks,
} from "@livekit/components-react";
import { createLocalVideoTrack, Track } from "livekit-client";
import { BackgroundBlur } from "@livekit/track-processors";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "@livekit/components-styles";

const MeetingParticipant = () => {
  const navigate = useNavigate();
  const { userName, roomId } = useParams();
  const [mtAccess, setMtAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const serverUrl = import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3100/get-token?roomName=${roomId}&identity=${userName}&name=${userName}&metadata=${"none"}`
      )
      .then((data) => {
        console.log(data.data);
        setLoading(false);
        setMtAccess(data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [roomId, userName]);

  if (loading) {
    return;
  }
  const onLeave = () => {
    navigate("/");
  };
  return (
    <div className=" bg-[#363636] ">
      <div className="px-5 flex items-center py-2 bg-[#363636] mx-auto">
        <h1 className="text-4xl font-bold  text-white">
          Let's <span className="text-green-500">Meet</span>
        </h1>
      </div>
      <div
        className=""
        style={{ height: "calc(100vh - 41px)" }}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={mtAccess?.accessToken}
          serverUrl={serverUrl}
          onDisconnected={onLeave}
          // Use the default LiveKit theme for nice styles.
          data-lk-theme="default"
          style={{ height: "95vh" }}>
          {/* Your custom component with basic video conferencing functionality. */}
          {/* <MyVideoConference /> */}

          <VideoConference chatMessageFormatter={formatChatMessageLinks} />

          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />

          {/* <ControlBar /> */}
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default MeetingParticipant;

const MyVideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const room = useRoomContext();
  const blur = async () => {
    const track = await createLocalVideoTrack();
    await track?.setProcessor(BackgroundBlur(100));
    room.localParticipant.publishTrack(track);
  };
  useEffect(() => {
    blur();
  }, [room]);

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height) - 42px)" }}>
      <ParticipantTile />
    </GridLayout>
  );
};
