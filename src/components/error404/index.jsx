import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Error404Page = () => {
  const navigate = useNavigate();

  const handleRedirectToHome = () => {
    navigate("/");
  };
  return (
    <div className="h-screen w-full flex flex-col gap-1 items-center justify-center">
      <span className="text-black font-bold">404 | Page Not Found</span>
      <Button onClick={handleRedirectToHome}>Redirect to Home page</Button>
    </div>
  );
};

export default Error404Page;
