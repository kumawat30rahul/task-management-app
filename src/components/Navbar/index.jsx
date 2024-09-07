import { Avatar } from "@mui/material";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import CommonDialog from "../common/common-dialog";
import { useNavigate } from "react-router-dom";
import { SheetDemo } from "./userDetailsSheet";
import { getUserDetails } from "@/Config/services";
import { dateFormater } from "../common/common-functions";
import { useToast } from "../ui/use-toast";
import { useCookies } from "react-cookie";
import { googleLogout } from "@react-oauth/google";

const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const { toast } = useToast();
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [isUserDetailsModal, setIsUserDetailsModal] = useState(false);
  const userId = JSON.parse(localStorage.getItem("userDetails"))?.userId;
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();

  const dialogContent = () => {
    return (
      <div className="flex flex-col items-start ">
        <span>Are you sure you want to logout?</span>
        <div className="flex items-center justify-start md:justify-end w-full gap-2 mt-2">
          <Button className="bg-blue-500" onClick={handleLogout}>
            Yes
          </Button>
          <Button className="bg-red-500" onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    );
  };

  const handleClose = () => {
    setIsLogoutModal(false);
  };

  const handleLogout = () => {
    const isGoogleUser = localStorage.getItem("isGoogleLogin");
    if (isGoogleUser === true) {
      googleLogout();
    }
    removeCookie("access_token", { path: "/" });
    localStorage.clear();
    toast({
      variant: "success",
      title: "Logout Success",
    });
    navigate("/login");
  };

  const openUserDetailsFunc = () => {
    setIsUserDetailsModal(true);
  };

  const getUserDetailsFunc = async (userId) => {
    try {
      const response = await getUserDetails(userId);
      if (response?.status === "ERROR") {
        setUserDetails(null);
        return;
      }
      setUserDetails(response?.data);
    } catch (error) {
      setUserDetails(null);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetailsFunc(userId);
    }
  }, [userId]);
  return (
    <div className="flex items-center justify-center p-2 bg-gradient-to-r backdrop-blur fixed top-0 left-0 right-0">
      <div className="flex items-center justify-between w-full ">
        <div className="h-full w-auto">
          <img
            src="https://i.imgur.com/5B9rCyp.png"
            alt="logo"
            className="h-10 w-auto rounded-lg"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <CommonDialog
            isOpen={isLogoutModal}
            setIsOpen={() => setIsLogoutModal(true)}
            dialogContent={dialogContent()}
            title={"Logout"}
            setIsClose={handleClose}
          >
            <Button className="bg-red-500 text-white hover:bg-red-700">
              Logout
            </Button>
          </CommonDialog>
          <SheetDemo
            triggerButton={
              <Avatar
                className="cursor-pointer"
                onClick={openUserDetailsFunc}
                src={userDetails?.logo}
              />
            }
          >
            <div className="w-full flex items-center justify-center flex-col gap-3">
              <div className="w-full flex items-center justify-center relative">
                <Avatar
                  src={userDetails?.logo}
                  sx={{ height: 100, width: 100 }}
                />
              </div>
              <div className="flex flex-col items-start gap-3 w-full">
                <div className="flex flex-col items-start justify-start">
                  <span>Name</span>
                  <span className="text-md font-bold">
                    {userDetails?.firstName + " " + userDetails?.lastName}
                  </span>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <span>Email</span>
                  <span className="text-md font-bold">
                    {userDetails?.email}
                  </span>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <span>Created At</span>
                  <span className="text-md font-bold">
                    {dateFormater(
                      userDetails?.createdAt,
                      "dd MMMM yyyy, hh:mm a"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </SheetDemo>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
