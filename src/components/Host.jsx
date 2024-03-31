import { useEffect, useState } from "react";

import { LiveKitRoom } from "@livekit/components-react";
import { jwtDecode } from "jwt-decode";

import { useParams } from "react-router-dom";
import HostControls from "./HostControls";
import ChatBox from "./ChatBox";
import axios from "axios";

export default function Host() {
  const { slug, room } = useParams();
  const [hostInfo, setHostInfo] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3100/broadcast/user-token?roomName=${slug}&identity=${slug}`)
      .then((data) => {
        setLoading(false);
        console.log(data.data);
        setHostInfo(data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [slug]);

  if (loading) {
    return;
  }
  return (
    <LiveKitRoom
      token={hostInfo?.accessToken}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="flex min-h-screen bg-gray-100">
      <div className="flex h-full flex-1 bg-gray-100">
        <div className="flex-1 flex-col px-8 py-2">
          <HostControls identity={hostInfo?.identity} />
        </div>
        <div className="sticky hidden top-0 w-80 h-[100vh] border-l md:block">
          <div className=" right-0 flex h-full w-full flex-col gap-2 p-2">
            {/* chat */}
            <ChatBox participantName={hostInfo?.identity} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
