import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { registerUser } from "@/Config/services";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { emailValidator } from "@/components/common/common-functions";
import { useToast } from "@/components/ui/use-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputLabel, setInputLabel] = useState("");
  const [inValidEmail, setInvalidEmail] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const [registeringUserLoader, setRegisteringUserLoader] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const handleUserInfoChange = (value, name) => {
    //condition to check id email is invalid or valid from client side
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
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerUserFunction = async (e) => {
    e.preventDefault();
    setRegisteringUserLoader(true);
    const payload = {
      ...userInfo,
      createdAt: new Date(),
    };
    try {
      const response = await registerUser(payload);
      if (response?.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setRegisteringUserLoader(false);
        return;
      }
      setRegisteringUserLoader(false);
      toast({
        variant: "success",
        title: response?.message,
      });
      navigate("/login");
    } catch (error) {
      setRegisteringUserLoader(false);
      toast({
        variant: "destructive",
        title: error?.message,
      });
    }
  };

  const renderInputs = useMemo(
    () => [
      {
        inputLabel: "First Name",
        inputValue: "firstName",
        errorMessage: "",
        inputPlaceholder: "First Name",
        inputType: "text",
      },
      {
        inputLabel: "Last Name",
        inputValue: "lastName",
        errorMessage: "",
        inputPlaceholder: "Last Name",
        inputType: "text",
      },
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
      {
        inputLabel: "Confirm Password",
        inputValue: "confirmedPassword",
        errorMessage: "",
        inputPlaceholder: "Enter your password again",
        inputType: "password",
      },
    ],
    [viewPassword]
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-4 py-5">
      <div className="w-full sm:w-auto h-auto flex flex-col items-center justify-start gap-4 sm:min-w-96">
        <div className="flex items-center">
          <img
            src="https://i.imgur.com/5B9rCyp.png"
            alt="logo"
            className="h-10 w-auto"
          />
          <span className="text-xl sm:text-2xl font-normal">TaskFlow</span>
        </div>
        <span className="text-lg sm:text-3xl font-semibold text-center">
          Get Organized, Get Started
        </span>
        <form
          onSubmit={registerUserFunction}
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
                    handleUserInfoChange(e.target.value, item?.inputValue)
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
              {inValidEmail && item?.inputValue === "email" && (
                <span className="text-xs text-red-500">Invalid Email</span>
              )}
            </div>
          ))}
          <div className="w-full h-auto">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {registeringUserLoader ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                "Signup"
              )}
            </Button>
          </div>
        </form>
        <div>
          <span className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
