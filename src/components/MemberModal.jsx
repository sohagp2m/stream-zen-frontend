import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar } from "@mui/material";
import { IoMdClose } from "react-icons/io";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

export default function MemberModal({ open, setOpen, member }) {
  const handleClose = () => setOpen(false);
  console.log(member[0].identity);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            className=""
            component="h2">
            Join member list.
          </Typography>

          <div className="mt-4 grid gap-2 px-2">
            {member?.map((item, index) => (
              <div
                key={index}
                className="flex border p-2 items-center gap-3">
                <Avatar
                  alt={item?.identity}
                  src="/static/images/avatar/1.jpg"
                />{" "}
                <p className="text-blue-800 font-bold text-lg cursor-pointer">{item?.identity}</p>
              </div>
            ))}
          </div>
          <span
            onClick={() => setOpen(false)}
            className="absolute -top-2 text-2xl cursor-pointer bg-red-400 rounded-full p-1 text-white  -right-2">
            <IoMdClose />
          </span>
        </Box>
      </Modal>
    </div>
  );
}
