import React from "react";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputGroup({ label, name, type = "text", placeholder, onChange, ...rest }: InputGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold ml-2 text-gray-800">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full h-10 bg-[#58C2A1] border-2 border-black rounded-full px-4 text-black outline-none placeholder:text-black/50 focus:border-[#25967A] transition-colors"
        {...rest}
      />
    </div>
  );
}