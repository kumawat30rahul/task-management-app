import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";

const UserDetailsSingupPage = () => {
  const [inputLabel, setInputLabel] = useState("");
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center py-5">
      <div className="w-auto h-auto flex flex-col items-center justify-start gap-4 min-w-96">
        <span className="text-3xl font-semibold">Update your details</span>
        <div className="w-auto flex items-center justify-center relative">
          <Pencil
            className="absolute top-2 -right-2 z-10 bg-white rounded-full cursor-pointer h-6 w-6"
            size={16}
          />
          <Avatar className="h-20 w-20 border border-gray-600 cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback>
              <img
                src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                className="h-10 w-auto"
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label
            className={`text-xs ${
              inputLabel === "fullName" && "text-blue-600"
            }`}
            htmlFor="fullName"
          >
            Full Name
          </label>
          <Input
            placeholder="Enter your email"
            onFocus={() => setInputLabel("fullName")}
            onBlur={() => setInputLabel("")}
            name="fullName"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label
            className={`text-xs ${
              inputLabel === "designation" && "text-blue-600"
            }`}
            htmlFor="designation"
          >
            Designation
          </label>
          <Input
            placeholder="Enter your email"
            onFocus={() => setInputLabel("designation")}
            onBlur={() => setInputLabel("")}
            name="designation"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <label
            className={`text-xs ${
              inputLabel === "department" && "text-blue-600"
            }`}
            htmlFor="department"
          >
            Department
          </label>
          <Input
            placeholder="Enter your email"
            onFocus={() => setInputLabel("department")}
            onBlur={() => setInputLabel("")}
            name="department"
          />
        </div>
        <div className="w-full h-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Save</Button>
        </div>
        <div>
          <span className="text-sm">
            <a href="/login" className="text-blue-600">
              {`Skip >>`}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSingupPage;
