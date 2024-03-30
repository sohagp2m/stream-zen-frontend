import { useState } from "react";
import { z } from "zod";
import icon from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const MeetingLogin = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("MTL5456");
  const [validateUserName, setvalidateUserName] = useState(false);
  const navigate = useNavigate();

  const joinAsParticipant = () => {
    navigate(`/join/meet-panel/${userName}/meeting/${roomId}`);
  };
  const joinAsAdmin = () => {
    navigate(`/join/meet-panel/${userName}/meeting/${roomId}`);
  };

  return (
    <div className="">
      <div className=" bg-[#363636] rounded-[1.5rem] max-w-2xl mx-auto p-8 shadow-md">
        <div className="flex gap-2 items-center pb-5">
          <img
            className="w-16"
            src={icon}
            alt=""
          />
          <h1 className="text-[2rem] font-bold text-gray-50">Join</h1>
        </div>
        <form className="text-white">
          <div className="grid gap-2">
            <label
              className="label"
              htmlFor="email">
              Username or Email address.
            </label>
            <input
              type="text"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
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
              Meeting ID
            </label>
            <input
              type="text"
              value={roomId}
              placeholder="Enter Streaming roomId."
              className="primary-input"
              required
            />
          </div>
          <div className="flex justify-between gap-2 items-center mt-6 px-4 flex-col lg:flex-row">
            <span
              onClick={joinAsAdmin}
              className="primary-btn w-full">
              {" "}
              Join as Admin
            </span>
            <span
              disabled={!validateUserName}
              onClick={joinAsParticipant}
              className="primary-btn w-full">
              {" "}
              Join as participant
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingLogin;
