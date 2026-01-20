import React, { InputHTMLAttributes, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "children"> & {
  id: string;
  type?: "email" | "password" | "text";
  registration: ReturnType<any>;
  label?: string;
  placeholder?: string;
  error?: string;
  children?: ReactNode;
  rightElement?: ReactNode;
};

const FormInput = ({
  id,
  type = "text",
  registration,
  label,
  placeholder,
  error,
  children,
  rightElement,
  className,
  ...rest
}: FormInputProps) => {
  console.log("rest", rest);
  return (
    <>
      <div className={`flex items-center justify-between gap-2 ${className}`}>
        <Label htmlFor={id} className="shrink-0">
          {label}
        </Label>
        <div className="shrink-0">{children}</div>
      </div>
      <div className="flex items-center gap-2">
        <Input id={id} type={type} placeholder={placeholder} {...registration} {...rest} />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
};

export default FormInput;
