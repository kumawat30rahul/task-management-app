import { emailValidator } from "@/components/common/common-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { googleLogin, loginUser } from "@/Config/services";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/components/ui/use-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useCookies } from "react-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  const { toast } = useToast();
  const [inputLabel, setInputLabel] = useState("");
  const [inValidEmail, setInvalidEmail] = useState(null);
  const [loginUserData, setLoginUserData] = useState({
    email: "",
    password: "",
  });
  const [loginLoader, setLoginLoader] = useState(false);
  const [googleLoginLoader, setGoogleLoginLoader] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const loginUserFunction = async () => {
    setLoginLoader(true);
    try {
      const response = await loginUser(loginUserData);
      if (response?.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setLoginLoader(false);
        return;
      }
      const userDetails = response?.data?.user;
      const access_token = response?.data?.at;
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      localStorage.setItem("access_token", access_token);
      setCookie("access_token", access_token, { path: "/" });
      toast({
        variant: "success",
        title: "Login Success",
      });
      navigate("/");
      setLoginLoader(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message,
      });
      setLoginLoader(false);
    }
  };

  const handleLoginUserDataChange = (value, name) => {
    if (name === "email") {
      if (value === "") {
        setInvalidEmail(false);
        return;
      }
      const validEmail = emailValidator(value);
      if (!validEmail) {
        setInvalidEmail(true);
        return;
      } else {
        setInvalidEmail(false);
      }
    }
    setLoginUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const creatingUser = async (googleCredential) => {
    setGoogleLoginLoader(true);
    const payload = {
      googleCredential: googleCredential,
    };
    try {
      const response = await googleLogin(payload);
      const userDetails = response?.data?.user;
      const access_token = response?.data?.at;
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("isGoogleLogin", true);
      setCookie("access_token", access_token, { path: "/" });
      setGoogleLoginLoader(false);
      toast({
        variant: "success",
        title: "Login Success",
      });
      navigate("/");
    } catch (error) {
      alert(error);
      setGoogleLoginLoader(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 py-5 ">
      <div className="w-full sm:w-auto h-auto flex flex-col items-center justify-start gap-4 sm:min-w-96">
        <span className="text-4xl font-semibold">Login</span>
        <div className="flex flex-col items-start w-full gap-2">
          <div className="flex items-center justify-between w-full">
            <label
              className={`text-xs ${inputLabel === "email" && "text-blue-600"}`}
              htmlFor="email"
            >
              Work Email
            </label>
            {inValidEmail && (
              <span className="text-xs text-red-500">Invalid Email</span>
            )}
          </div>
          <div className="relative w-full">
            <Input
              placeholder="Enter your email"
              onFocus={() => setInputLabel("email")}
              onBlur={() => {
                setInputLabel("");
              }}
              name="email"
              onChange={(e) =>
                handleLoginUserDataChange(e.target.value, "email")
              }
            />
          </div>
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label
            className={`text-xs ${
              inputLabel === "password" && "text-blue-600"
            }`}
            htmlFor="password"
          >
            Your Password
          </label>
          <div className="w-full relative">
            <Input
              placeholder="Password"
              onFocus={() => setInputLabel("password")}
              onBlur={() => setInputLabel("")}
              name="password"
              type={viewPassword ? "text" : "password"}
              onChange={(e) =>
                handleLoginUserDataChange(e.target.value, "password")
              }
            />
            <div className="absolute right-2 top-1">
              {!viewPassword ? (
                <VisibilityIcon
                  className="cursor-pointer"
                  onClick={() => setViewPassword(true)}
                />
              ) : (
                <VisibilityOffIcon
                  className="cursor-pointer"
                  onClick={() => setViewPassword(false)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-auto">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={loginUserFunction}
          >
            {loginLoader ? (
              <CircularProgress size={18} sx={{ color: "white !important" }} />
            ) : (
              "Login"
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-start gap-3">
          <span className="text-sm">- or Continue With -</span>
          <div className="flex items-center justify-center gap-1">
            {/* <Button className="w-full flex items-center justify-center rounded-full bg-white text-black border border-gray-500 hover:bg-gray-500/20 text-md">
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                alt="google"
                className="h-5 w-5"
              /> */}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                creatingUser(credentialResponse);
              }}
              onError={() => {
                alert("Login Failed");
              }}
            />
            {googleLoginLoader && <CircularProgress size={20} />}
            {/* </Button> */}
          </div>
        </div>
        <div>
          <span className="text-sm">
            Dont have an account?{" "}
            <a href="/signup" className="text-blue-600">
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
