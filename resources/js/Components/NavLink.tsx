import React from "react";
import { Link } from "@inertiajs/react";
import { useLocation } from "react-router-dom";

interface NavLinkProps {
    href: string;
    icon?: JSX.Element;
    label: string;
    className?: '',
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label, className }) => {
    const location = useLocation();
    const isActive = location.pathname.includes(href);

    return (
        <Link
            href={route(href)}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                isActive ? "bg-graydark dark:bg-meta-4" : ""
            }` + className}
        >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
        </Link>
    );
};

export default NavLink;
