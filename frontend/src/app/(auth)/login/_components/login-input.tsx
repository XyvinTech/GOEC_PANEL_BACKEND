import { Mail } from "lucide-react";
import React, { InputHTMLAttributes, ReactElement } from "react";

type LoginInputProps =  InputHTMLAttributes<HTMLInputElement> & {
    icon: ReactElement
}

const LoginInput = ({ icon, ...inputProps }: LoginInputProps) => {
  return (
    <div className="h-fit flex items-center gap-2 bg-white rounded p-2 lg:p-4 focus-within:ring-2 focus-within:ring-blue-500">
    {icon}
      <input
        {...inputProps}
        className="bg-transparent text-sm h-fit text-black focus:outline-none placeholder:text-[#87898E]"
      />
    </div>
  );
};

export default LoginInput;
