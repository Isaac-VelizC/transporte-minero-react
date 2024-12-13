import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ClickOutside from "@/Components/ClickOutside";

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = usePage().props.auth.user;

    return (
        <ClickOutside
            onClick={() => setDropdownOpen(false)}
            className="relative"
        >
            <a
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                href="#"
            >
                <span className="hidden text-right lg:block">
                    <span className="block text-sm font-medium text-black dark:text-white">
                        {user.name}
                    </span>
                    <span className="block text-xs">{user.email}</span>
                </span>

                <span
                    className="h-12 w-12 rounded-full bg-cover bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url(https://freepngimg.com/download/bugs/117617-bugs-bunny-free-clipart-hq.png",
                        backgroundPosition: "center",
                    }}
                />

                <i className="bi bi-chevron-down"></i>
            </a>

            {/* <!-- Dropdown Start --> */}
            {dropdownOpen && (
                <div
                    className={`absolute right-0 mt-4 flex w-52 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
                >
                    <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
                        <li>
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                            >
                                <i className="bi bi-person"></i>
                                My Profile
                            </Link>
                        </li>
                    </ul>
                    <Link
                        href={route("logout")}
                        method="post"
                        className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                    >
                        <i className="bi bi-box-arrow-left"></i>
                        Log Out
                    </Link>
                </div>
            )}
            {/* <!-- Dropdown End --> */}
        </ClickOutside>
    );
};

export default DropdownUser;
