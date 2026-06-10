import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface SelectGroupProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export default function SelectGroup({ label, name, options, value, onChange, ...rest }: SelectGroupProps) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={name} className="text-sm font-semibold ml-2 text-gray-800">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className="w-full h-10 bg-[#58C2A1] border-2 border-black rounded-full px-4 text-black outline-none appearance-none cursor-pointer focus:border-[#25967A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          {...rest}
        >
          <option value="" disabled className="text-black/50">
            Selecione
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-black bg-white">
              {opt}
            </option>
          ))}
        </select>
        <MdKeyboardArrowDown
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black"
          size={20}
        />
      </div>
    </div>
  );
}