import { emailValidator } from "@/components/common/common-functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { googleLogin, loginUser } from "@/Config/services";
import { CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
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

  const loginUserFunction = async (e) => {
    e.preventDefault();
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

  const renderInputs = useMemo(
    () => [
      {
        inputLabel: "Email",
        inputValue: "email",
        errorMessage: "",
        inputPlaceholder: "Enter your email",
        inputType: "text",
      },
      {
        inputLabel: "Password",
        inputValue: "password",
        errorMessage: "",
        inputPlaceholder: "Enter your password",
        inputType: viewPassword ? "text" : "password",
      },
    ],
    [viewPassword]
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 py-5 ">
      <div className="w-full sm:w-auto h-auto flex flex-col items-center justify-start gap-4 sm:min-w-96">
        <span className="text-4xl font-semibold">Login</span>
        <form
          onSubmit={loginUserFunction}
          className="w-full flex flex-col items-center justify-start gap-4"
        >
          {renderInputs?.map((item) => (
            <div className="flex flex-col items-start w-full gap-2">
              <label
                className={`text-xs ${
                  inputLabel === item?.inputValue && "text-blue-600 font-bold"
                }`}
                htmlFor={item?.inputValue}
              >
                {item?.inputLabel}
              </label>
              <div className="w-full relative">
                <Input
                  placeholder={item?.inputPlaceholder}
                  onFocus={() => setInputLabel(item?.inputValue)}
                  type={item?.inputType}
                  onBlur={() => setInputLabel("")}
                  name={item?.inputValue}
                  onChange={(e) =>
                    handleLoginUserDataChange(e.target.value, item?.inputValue)
                  }
                />
                {item?.inputValue === "password" && (
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
                )}
              </div>
            </div>
          ))}
          <div className="w-full h-auto">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
            >
              {loginLoader ? (
                <CircularProgress
                  size={18}
                  sx={{ color: "white !important" }}
                />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
        <div className="flex flex-col items-center justify-start gap-3">
          <span className="text-sm">- or Continue With -</span>
          <div className="flex items-center justify-center gap-1">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                creatingUser(credentialResponse);
              }}
              onError={() => {
                alert("Login Failed");
              }}
            />
            {googleLoginLoader && <CircularProgress size={20} />}
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
