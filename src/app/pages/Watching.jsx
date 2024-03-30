import { useEffect, useMemo, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";

import { faker } from "@faker-js/faker";
import { jwtDecode } from "jwt-decode";
import Actions from "../../utils/actions";
import StreamPlayerWrapper, { StreamPlayer } from "../../components/SteramPlayer";
import ChatBox from "../../components/ChatBox";
import StreamInfo from "../../components/StreamInfo";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Watching() {
  const { userName, room } = useParams();
  const [hostInfo, setHostInfo] = useState({});
  const [roomName, setRoom] = useState("");
  console.log(userName);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3100/broadcast/user-token?roomName=yourRoomName&identity=${userName}&name=${userName}&metadata=userMetadata`
      )
      .then((data) => {
        setLoading(false);
        console.log(data.data);
        setHostInfo(data.data);
        const decoded = jwtDecode(data.data?.accessToken)?.video?.room;
        console.log(decoded);
        setRoom(decoded);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  if (loading) {
    return;
  }

  return (
    <LiveKitRoom
      token={hostInfo?.accessToken}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="flex flex-1 flex-col">
      {/* <WatchingAsBar viewerName={viewerName} /> */}
      <div className="flex h-full flex-1">
        <div className="flex-1 flex-col container">
          <StreamPlayerWrapper streamerIdentity={roomName} />
          <StreamInfo
            streamerIdentity={roomName}
            viewerIdentity={userName}
          />
        </div>
        <div className="sticky hidden w-80 border-l md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <ChatBox participantName={hostInfo?.identity} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
