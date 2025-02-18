import { Link } from "react-router-dom";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import LogoIcon from "@/assets/images/logo.webp";
import LogoMenu from "@/Components/LogoMenu";
import { usePage } from "@inertiajs/react";

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    const { user } = usePage().props.auth;
    return (
        <header className="sticky top-0 z-999 flex w-full drop-shadow-1 bg-white dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between md:justify-end px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <LogoMenu sidebarOpen={!props.sidebarOpen} />
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" to="/">
                        <img
                            src={LogoIcon}
                            alt="Transporte Minero"
                            className="h-16 w-16"
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {user.id === 3 && <DropdownNotification />}
                    </ul>

                    {/* <!-- User Area --> */}
                    <DropdownUser />
                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
