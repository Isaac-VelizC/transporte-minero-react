import React, { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import Logo from "@/assets/images/logo.png";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Header del sidebar */}
            <div className="flex items-center justify-between gap-2 px-6 py-2 lg:py-4">
                <Link href="/" className="flex items-center overflow-hidden">
                    <img src={Logo} alt="Transporte Minero" className="h-16 w-16"  />
                    <h1 className="font-bold text-sm">Transporte Minero</h1>
                </Link>
                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    {/* Botón de cerrar */}
                </button>
            </div>

            {/* Menú del sidebar */}
            <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                <div>
                    <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                        MENU
                    </h3>
                    <ul className="mb-6 flex flex-col gap-1.5">
                        <li>
                            <NavLink
                                href="dashboard"
                                icon={<i className="bi bi-columns-gap"></i>}
                                label="Dashboard"
                            />
                        </li>
                        <li>
                            <NavLink
                                href="user.list"
                                icon={<i className="bi bi-people"></i>}
                                label="Usuarios"
                            />
                        </li>

                        <li>
                            <NavLink
                                href="vehicle.list"
                                icon={<i className="bi bi-truck-front"></i>}
                                label="Vehiculos"
                            />
                        </li>
                        <li>
                            <NavLink
                                href="envios.list"
                                icon={<i className="bi bi-truck"></i>}
                                label="Envios"
                            />
                        </li>
                        <li>
                            <NavLink
                                href="geocerca.list"
                                icon={<i className="bi bi-geo-alt"></i>}
                                label="Geocercas"
                            />
                        </li>
                        <li>
                            <NavLink
                                href="view.map"
                                icon={<i className="bi bi-geo-fill"></i>}
                                label="Monitoreo"
                            />
                        </li>

                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                            OTROS
                        </h3>
                        <li>
                            <NavLink
                                href="user.list"
                                icon={<i className="bi bi-journals"></i>}
                                label="Reportes"
                            />
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
