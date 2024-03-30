import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../app/Layouts/MainLayouts";
import GetStart from "../app/pages/GetStart";
import Host from "../components/Host";

import ErrorPage from "../app/pages/ErrorPage";
import Watching from "../app/pages/Watching";
import MeetingParticipant from "../components/MeetingParticipant";
import AdminMeeting from "../components/AdminMeeting";
import ConferencePanel from "../components/ConferencePanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        path: "/",
        element: <GetStart />,
      },
      {
        path: "/host/channel/:slug/stream/:room",
        element: <Host />,
      },
      {
        path: "/view/channel/:userName/stream/:room",
        element: <Watching />,
      },
      {
        path: "/join/participant/:userName/meeting/:meetingId",
        element: <MeetingParticipant />,
      },
      {
        path: "/admin/panel/:userName/meeting/:roomId",
        element: <AdminMeeting />,
      },
      {
        path: "/join/meet-panel/:userName/meeting/:roomId",
        element: <ConferencePanel />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
