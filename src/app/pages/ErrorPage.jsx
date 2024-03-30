import { MdErrorOutline } from "react-icons/md";
const ErrorPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-2 flex items-center flex-col">
        <MdErrorOutline className="text-7xl" />
        <h1>An error occurred</h1>
        <p>Something went wrong.</p>
        <button
          className="primary-btn"
          onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
