import LoginForm from "../../components/LoginForm";
import MeetingLogin from "../../components/MeetingLogin";

const GetStart = () => {
  return (
    <div className="flex min-h-screen  bg-[#1D1D1D] px-4 m-0 items-center justify-center w-full">
      <div className="w-full container mx-auto">
        <LoginForm />
        {/* <MeetingLogin /> */}
      </div>
    </div>
  );
};

export default GetStart;
