import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
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
                <div className="header-top">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-center md:gap-4">
                            {/* Columna Izquierda */}
                            <div className="flex items-center text-center lg:text-left">
                                <ul className="flex items-center">
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-clock"></i>
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
                                            <Link href={route("dashboard")}>
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("logout")}
                                                className="flex gap-2"
                                            >
                                                <span>Salir</span>
                                                <i className="bi bi-box-arrow-left"></i>
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link href={route("login")}>
                                            Acceso
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="header-area" id="sticky-header">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap items-center justify-between">
                            {/* Logo */}
                            <div className="w-1/3 sm:w-1/4 md:w-auto">
                                <div className="h-20 w-20">
                                    <a href="/">
                                        <img
                                            src="assets/images/logo/logo.png"
                                            alt="Benjamin"
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Menú Principal */}
                            <div className="hidden lg:block w-2/3">
                                <div className="main-menu">
                                    <nav className="nav_mobile_menu">
                                        <ul className="text-gray-700">
                                            <li className="active">
                                                <a
                                                    onClick={() =>
                                                        scrollToSection("hero")
                                                    }
                                                >
                                                    Home
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    onClick={() =>
                                                        scrollToSection("about")
                                                    }
                                                >
                                                    Acerca
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    onClick={() =>
                                                        scrollToSection(
                                                            "service"
                                                        )
                                                    }
                                                >
                                                    Servicios
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    onClick={() =>
                                                        scrollToSection(
                                                            "contact"
                                                        )
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
                    <div className="container mx-4 lg:mx-auto">
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
                        <div className="md:w-3/4 lg:w-2/4">
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
                <div className="container lg:mx-auto">
                    <div className="w-full">
                        <div className="section-title text-center">
                            <span>Brindamos lo mejor</span>
                            <h2>Nuestro Servicio</h2>
                        </div>
                    </div>
                    <div className="services-area">
                        <div className="container mx-auto">
                            <div className="flex flex-wrap">
                                {/* Servicio 1 */}
                                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
                                    <div className="service-item">
                                        <div className="service-single">
                                            <div className="service-icon text-4xl mb-4">
                                                <i className="fi flaticon-truck"></i>
                                            </div>
                                            <h2>Transporte Terrestre</h2>
                                            <p>
                                                Transporte seguro y eficiente de
                                                minerales con vehículos
                                                especializados.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Servicio 2 */}
                                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
                                    <div className="service-item">
                                        <div className="service-single">
                                            <div className="service-icon text-4xl mb-4">
                                                <i className="fi flaticon-construction"></i>
                                            </div>
                                            <h2>Soluciones Logísticas</h2>
                                            <p>
                                                Optimización del transporte y
                                                almacenamiento para una
                                                ejecución eficiente.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Servicio 3 */}
                                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
                                    <div className="service-item">
                                        <div className="service-single">
                                            <div className="service-icon text-4xl mb-4">
                                                <i className="flaticon-truck-2"></i>
                                            </div>
                                            <h2>Embalaje y Almacenamiento</h2>
                                            <p>
                                                Servicios de embalaje y
                                                almacenamiento adaptados a sus
                                                necesidades.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* service-area end*/}
            {/*contact-area start */}
            <div id="contact" className="mx-4 section-padding">
                <div className="container mx-auto">
                    <div className="contact-page-item">
                        <h2>Nuestros contactos</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="adress">
                                <h3>Dirección</h3>
                                <span>
                                    245 King Street, Touterie Victoria 8520
                                    Australia
                                </span>
                            </div>
                            <div className="phone">
                                <h3>Teléfono</h3>
                                <span>0-123-456-7890</span>
                                <span>0-123-456-7890</span>
                            </div>
                            <div className="email">
                                <h3>Correo Electronico</h3>
                                <span>sample@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*populer-area end */}
            {/*.footer-area start */}
            <div className="footer-area">
                <div className="footer-bottom">
                    <div className="container">
                        <div className="footer-bottom-content">
                            <div className="row">
                                <div className="col-12">
                                    <span>
                                        Copyright &copy;{" "}
                                        {new Date().getFullYear()} Todos los
                                        derechos reservados | Hecho con{" "}
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
                                            AIsakVeliz
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
