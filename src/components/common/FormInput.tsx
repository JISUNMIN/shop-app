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
};

const FormInput = ({
  id,
  type = "text",
  registration,
  label,
  placeholder,
  error,
  children,
  ...rest
}: FormInputProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {children}
      </div>

      <Input id={id} type={type} placeholder={placeholder} {...registration} {...rest} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
};

export default FormInput;
