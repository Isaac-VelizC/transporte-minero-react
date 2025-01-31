import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CardService from "@/Components/Cards/CardService";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [loading, setLoading] = useState(true);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Cambia a `false` después de 3 segundos
        return () => clearTimeout(timer); // Limpiar el temporizador
    }, []);

    return (
        <>
            <Head title="Welcome" />
            {loading && (
                <div className="page-loader">
                    <div className="page-loader-inner">
                        <div className="inner"></div>
                    </div>
                </div>
            )}
            {/* header-area start */}
            <header>
                <div className="bg-[#142440]">
                    <div className="container mx-auto text-white py-5 px-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center md:gap-4">
                            {/* Columna Izquierda */}
                            <div className="flex items-center text-center lg:text-left mb-4">
                                <ul className="flex items-center">
                                    <li className="flex items-center gap-2">
                                        Lunes a martes: 6:00 a. m. - 10:00 p.
                                        m., domingo cerrado
                                    </li>
                                </ul>
                            </div>

                            {/* Columna Derecha */}
                            <ul className="flex items-center gap-4">
                                {auth.user ? (
                                    <>
                                        <li>
                                            <Link
                                                href={route("dashboard")}
                                                className="hover:text-blue-600 transition duration-300 ease-in-out"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                className="flex gap-2 hover:text-blue-600 transition duration-300 ease-in-out"
                                            >
                                                <span>Salir</span>
                                                <i className="bi bi-box-arrow-left"></i>
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link
                                            href={route("login")}
                                            className="hover:text-blue-600 transition duration-300 ease-in-out"
                                        >
                                            Acceso
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="w-full absolute z-99 bg-[#ffffff1a] border-b-[1px] border-solid"
                    id="sticky-header"
                >
                    <div className="container mx-auto">
                        <div className="flex flex-wrap items-center justify-between">
                            {/* Logo */}
                            <div className="w-1/3 sm:w-1/4 md:w-auto">
                                <div className="h16 w-16">
                                    <a href="/">
                                        <img
                                            src="assets/images/logo/logo.webp"
                                            alt="Benjamin"
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Menú Principal */}
                            <div className="hidden lg:block w-2/3">
                                <nav className="text-right relative pr-6">
                                    <ul className="text-white flex items-center font-semibold gap-8 justify-end text-lg">
                                        <li className="active text-blue-400 cursor-pointer">
                                            <a
                                                onClick={() =>
                                                    scrollToSection("hero")
                                                }
                                            >
                                                Home
                                            </a>
                                        </li>
                                        <li className="cursor-pointer hover:text-blue-400">
                                            <a
                                                onClick={() =>
                                                    scrollToSection("about")
                                                }
                                            >
                                                Acerca
                                            </a>
                                        </li>
                                        <li className="cursor-pointer hover:text-blue-400">
                                            <a
                                                onClick={() =>
                                                    scrollToSection("service")
                                                }
                                            >
                                                Servicios
                                            </a>
                                        </li>
                                        <li className="cursor-pointer hover:text-blue-400">
                                            <a
                                                onClick={() =>
                                                    scrollToSection("contact")
                                                }
                                            >
                                                Contacto
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/** header-area end */}
            {/** start of hero */}
            <section id="hero" className="relative h-screen">
                <div className="relative">
                    <img
                        src="assets/images/slider/5.webp"
                        className="absolute inset-0 opacity-70 w-full h-full object-cover"
                    />
                    <div className="w-full h-full absolute bg-black-2 opacity-50"></div>
                    <div className="container px-4 lg:mx-auto">
                        <div className="flex items-center h-screen">
                            <div className="lg:w-9/12 w-full z-20">
                                <h1 className="font-bold text-3xl lg:text-6xl text-white leading-relaxed mb-8">
                                    <span>Proporcionamos Soluciones </span>
                                    <span>Confiables para el Transporte </span>
                                    <span>Seguro de Minerales.</span>
                                </h1>
                                <PrimaryButton
                                    type="button"
                                    className="py-3"
                                    onClick={() => scrollToSection("contact")}
                                >
                                    Contactanos
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* end of hero slider */}
            {/* .about-area start */}
            <div id="about" className="mx-4 my-10 lg:my-24">
                <div className="container lg:mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="md:w-3/4 lg:w-2/5">
                            <div className="about-img">
                                <img
                                    src="assets/images/about/2764.webp"
                                    alt="Company Overview"
                                />
                            </div>
                        </div>
                        <div className="lg:w-2/4">
                            <div className="about-content">
                                <h2>¿Quiénes Somos?</h2>
                                <p>
                                    La empresa de transporte Benjamin S.R.L.
                                    somos líderes en la industria minera,
                                    dedicados a la extracción y transporte de
                                    minerales de alta calidad. Con más de [X
                                    años] de experiencia en el sector, nos
                                    comprometemos a ofrecer soluciones
                                    eficientes y sostenibles a nuestros
                                    clientes.
                                </p>
                                <p>
                                    Nuestra misión es proporcionar minerales
                                    esenciales para el desarrollo industrial,
                                    garantizando un proceso seguro y
                                    responsable. Valoramos la transparencia y la
                                    ética en todas nuestras operaciones, lo que
                                    nos ha permitido construir relaciones
                                    sólidas con nuestros socios comerciales.
                                </p>
                                <span>
                                    Comprometidos con la sostenibilidad.
                                </span>
                                <span>
                                    Innovación en cada etapa del proceso.
                                </span>
                                <span>
                                    Calidad y seguridad como nuestras
                                    prioridades.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* about-area end */}
            {/* service-area start*/}
            <div id="service" className="service-area service-s2 px-4">
                <div className="container mx-auto">
                    <div className="w-full">
                        <div className="section-title text-center">
                            <span>Brindamos lo mejor</span>
                            <h2>Nuestro Servicio</h2>
                        </div>
                    </div>
                    <div className="services-area">
                        <div className="container">
                            <div className="flex flex-wrap">
                                {/* Servicio 1 */}
                                <CardService
                                    title="Transporte Terrestre"
                                    description="Transporte seguro y eficiente de minerales con vehículos especializados."
                                />
                                <CardService
                                    title="Soluciones Logísticas"
                                    description="Optimización del transporte y almacenamiento para una ejecución eficiente."
                                />
                                <CardService
                                    title="Embalaje y Almacenamiento"
                                    description="Servicios de embalaje y almacenamiento adaptados a sus necesidades."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* service-area end*/}
            {/*contact-area start */}
            <div
                id="contact"
                className="py-10 bg-[#142440] border-b-[1px] border-solid px-4"
            >
                <div className="container mx-auto">
                    <h2 className="text-3xl mb-7 font-semibold text-white">
                        Nuestros contactos
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="adress">
                            <h3 className="text-2xl mb-2 text-white">
                                Dirección
                            </h3>
                            <span>
                                245 King Street, Touterie Victoria 8520
                                Australia
                            </span>
                        </div>
                        <div className="phone">
                            <h3 className="text-2xl mb-2 text-white">
                                Teléfono
                            </h3>
                            <span>0-123-456-7890</span>
                            <span>0-123-456-7890</span>
                        </div>
                        <div className="email">
                            <h3 className="text-2xl mb-2 text-white">
                                Correo Electronico
                            </h3>
                            <span>sample@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>
            {/*populer-area end */}
            {/*.footer-area start */}
            <div className="bg-[#142440]">
                <div className="py-7">
                    <div className="container mx-auto">
                        <div className="text-center">
                            <span className="text-white text-base text-center">
                                Copyright &copy; {new Date().getFullYear()}{" "}
                                Todos los derechos reservados | Hecho con{" "}
                                <i
                                    className="icon-heart"
                                    aria-hidden="true"
                                ></i>{" "}
                                por{" "}
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-white"
                                >
                                    Transportes Benjamín
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
