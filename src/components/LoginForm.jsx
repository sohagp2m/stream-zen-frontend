import { useState } from "react";
import { z } from "zod";
import icon from "../assets/logo.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slugSchema = z
  .string()
  .regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
  .min(3);

const LoginForm = () => {
  const [slug, setSlug] = useState("");
  const [room, setRoom] = useState("RMADFL500");
  const [validSlug, setValidSlug] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      slugSchema.parse(slug);
      setValidSlug(true);
    } catch {
      setValidSlug(false);
    }
  }, [slug]);

  console.log(slug);

  const handleJoinAsViewer = () => {
    navigate(`/view/channel/${slug}/stream/${room}`);
  };
  const handleJoinHost = () => {
    navigate(`/host/channel/${slug}/stream/${room}`);
  };

  return (
    <div className="">
      <div className="shadow-inner rounded-[1.5rem] max-w-2xl bg-gray-900 mx-auto p-8 ">
        <div className="flex gap-2 items-center pb-5">
          <img
            className="w-16"
            src={icon}
            alt=""
          />
          <h1 className="text-[2rem] font-bold text-gray-50">Broadcast</h1>
        </div>
        <form>
          <div className="grid gap-2">
            <label
              className="label"
              htmlFor="email">
              Username or Email address.
            </label>
            <input
              type="text"
              onChange={(e) => {
                setSlug(e.target.value);
              }}
              value={slug}
              placeholder="Enter your username or email"
              className="primary-input"
              required
            />
          </div>

          <div className="grid mt-4 gap-2">
            <label
              className="label"
              htmlFor="email">
              Password
            </label>
            <input
              required
              disabled
              type="password"
              placeholder="********"
              className="primary-input"
            />
          </div>
          <div className="grid mt-4 gap-2">
            <label
              className="label"
              htmlFor="email">
              Stream Room
            </label>
            <input
              type="text"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
              value={room}
              placeholder="Enter Streaming Room."
              className="primary-input"
              required
            />
          </div>
          <div className="flex justify-between gap-2 items-center mt-6 px-4 flex-col lg:flex-row">
            <span
              onClick={handleJoinHost}
              className="primary-btn w-full">
              {" "}
              Join as Host
            </span>
            <span
              disabled={!validSlug}
              onClick={handleJoinAsViewer}
              className="primary-btn w-full">
              {" "}
              Join as Viewer
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
