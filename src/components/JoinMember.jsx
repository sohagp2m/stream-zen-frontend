import { FaRegEye, FaUser } from "react-icons/fa6";
import MemberModal from "./MemberModal";
import { useState } from "react";
const JoinMember = ({ member }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className=" flex items-end">
      <p
        onClick={() => setOpen(true)}
        className="flex items-center font-bold gap-2 text-2xl cursor-pointer text-blue-800">
        <span>
          <FaUser />
        </span>
        <span>{member?.length}</span>
      </p>
      <MemberModal
        open={open}
        setOpen={setOpen}
        member={member}
      />
    </div>
  );
};

export default JoinMember;
