import React, { useState, useEffect } from "react";
import { Menu, X, Truck } from "lucide-react";
import { Link } from "@inertiajs/react";
import { User } from "@/types";

type PropsHeader = {
    authStatus: User;
};

const navLinkClasses =
    "text-white hover:text-amber-400 cursor-pointer font-medium transition-all duration-300 hover:scale-105 relative group";
const underlineClasses =
    "absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300";

const mobileNavLinkClasses =
    "text-white hover:text-amber-400 cursor-pointer font-medium py-2 px-4 hover:bg-slate-700/30 rounded-lg transition-all duration-200";

const ctaButtonClasses =
    "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl";

export default function HeaderClient({ authStatus }: PropsHeader) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
    };

    const NavLink = ({
        label,
        section,
    }: {
        label: string;
        section: string;
    }) => (
        <a onClick={() => scrollToSection(section)} className={navLinkClasses}>
            {label}
            <span className={underlineClasses}></span>
        </a>
    );

    const MobileNavLink = ({
        label,
        section,
    }: {
        label: string;
        section: string;
    }) => (
        <a
            onClick={() => scrollToSection(section)}
            className={mobileNavLinkClasses}
        >
            {label}
        </a>
    );
    return (
        <>
            <header
                className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                    isScrolled
                        ? "bg-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-slate-700/50"
                        : isMenuOpen
                        ? "bg-slate-900/95 backdrop-blur-lg"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <div className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="text-white">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                                    TransFrank
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <NavLink label="Inicio" section="hero" />
                            {authStatus && (
                                <Link
                                    href={route("dashboard")}
                                    className={navLinkClasses}
                                >
                                    Dashboard
                                    <span className={underlineClasses}></span>
                                </Link>
                            )}
                            <NavLink label="Acerca" section="about" />
                            <NavLink label="Servicios" section="services" />
                            <NavLink label="Contacto" section="contact" />
                        </nav>

                        {/* CTA Button & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <Link
                                href={route(authStatus ? "logout" : "login")}
                                method={authStatus ? "post" : undefined}
                                className={`hidden md:block ${ctaButtonClasses}`}
                            >
                                {authStatus ? "Salir" : "Iniciar Sesión"}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`lg:hidden overflow-hidden transition-all duration-300 ${
                            isMenuOpen
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <nav className="py-4 border-t border-slate-700/50">
                            <div className="flex flex-col gap-4">
                                <MobileNavLink label="Inicio" section="hero" />
                                <MobileNavLink label="Acerca" section="about" />
                                <MobileNavLink
                                    label="Servicios"
                                    section="services"
                                />
                                <MobileNavLink
                                    label="Contacto"
                                    section="contact"
                                />
                                <Link
                                    href={route(
                                        authStatus ? "logout" : "login"
                                    )}
                                    method={authStatus ? "post" : undefined}
                                    className={ctaButtonClasses}
                                >
                                    {authStatus ? "Salir" : "Iniciar Sesión"}
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}
