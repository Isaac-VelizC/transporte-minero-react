import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface Props {
    className?: string;
    children: ReactNode;
    href: string;
}

const LinkButton: React.FC<Props> = ({
    className = "",
    children,
    href,
    ...props
}) => {
    return (
        <Link
            href={route(href)}
            {...props}
            className={`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${className}`}
        >
            {children}
        </Link>
    );
};

export default LinkButton;
