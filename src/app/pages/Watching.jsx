import { useEffect, useMemo, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";

import { jwtDecode } from "jwt-decode";
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
      .get(`http://localhost:3100/broadcast/user-token?roomName=${room}&identity=${userName}`)
      .then((data) => {
        setLoading(false);
        console.log(data.data);
        setHostInfo(data.data);
        const decoded = jwtDecode(data.data?.accessToken);
        console.log(decoded);
        setRoom(userName);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [room, userName]);

  if (loading) {
    return;
  }

  return (
    <div className="">
      <div className="bg-green-500">
        <p className="py-3 px-16 text-white text-[1.5rem]">Watching...</p>
      </div>
      <LiveKitRoom
        token={hostInfo?.accessToken}
        serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL}
        className="px-12">
        {/* <WatchingAsBar viewerName={viewerName} /> */}
        <div className="grid p-4 lg:grid-cols-3 h-full ">
          <div className="lg:col-span-2 border shadow-sm">
            <StreamPlayerWrapper identity={room} />
            <StreamInfo
              streamerIdentity={room}
              viewerIdentity={room}
            />
          </div>
          <div className="sticky lg:col-span-1 hidden w-full  border rounded-sm shadow-sm md:block">
            <div className="absolute top-0 bottom-0 right-0 flex w-full flex-col gap-2 p-2">
              <ChatBox participantName={hostInfo?.identity} />
            </div>
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
}
