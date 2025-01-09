import { InputHTMLAttributes } from "react";

export default function Checkbox({
    className = "",
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "transition-all duration-500 ease-in-out w-8 h-8 rounded-xl border-gray-300 text-green-600 shadow-sm focus:ring-green-500 " +
                className
            }
        />
    );
}
