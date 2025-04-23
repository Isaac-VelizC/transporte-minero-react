import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string, required?: boolean }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-400 ` +
                className
            }
        >
            {value ? value : children} {props.required && <span className="text-red-600">*</span>}
        </label>
    );
}