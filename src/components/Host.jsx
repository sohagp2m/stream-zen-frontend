import { useEffect, useState } from "react";

import { ControlBar, LiveKitRoom } from "@livekit/components-react";
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
      .get(`http://localhost:3100/broadcast/host-token?identity=${room}`)
      .then((data) => {
        setLoading(false);
        console.log(data.data);
        setHostInfo(data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [room]);

  if (loading) {
    return;
  }
  return (
    <LiveKitRoom
      token={hostInfo?.accessToken}
      serverUrl={import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_WS_URL}
      className=" min-h-screen bg-gray-100">
      <div className="grid lg:grid-cols-3 bg-gray-100">
        <div className=" w-full border lg:col-span-2 flex-col px-8 py-2">
          <HostControls identity={hostInfo?.identity} />
        </div>
        <div className="sticky  border  top-5 w-full h-[95vh] border-l md:block">
          <div className=" right-0 flex h-full w-full flex-col gap-2 p-2">
            <ChatBox participantName={hostInfo?.identity} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
