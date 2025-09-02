import { useState, useEffect } from "react";
import HeroImg from "../assets/images/hero-img.jpeg";
import {
    ChevronDown,
    Shield,
    Truck,
    BarChart3,
    MapPin,
} from "lucide-react";

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="hero" className="relative h-auto top-0 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {/* Simulated mining truck image with CSS gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-amber-900"></div>
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url(${HeroImg})`,
                    }}
                ></div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Animated Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
            </div>

            {/* Content */}
            <div className="container mt-24 mb-8 px-4 mx-auto relative z-10">
                <div className="flex items-center h-auto">
                    <div className="lg:w-9/12 w-full">
                        {/* Badge */}
                        <div
                            className={`inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-2 mb-6 transform transition-all duration-1000 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <Shield className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-200 text-sm font-medium">
                                Tecnología de Monitoreo Avanzada
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1
                            className={`font-bold text-4xl lg:text-7xl text-white leading-tight mb-8 transform transition-all duration-1000 delay-300 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <span className="block mb-2">Proporcionamos</span>
                            <span className="block mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Soluciones Confiables
                            </span>
                            <span className="block">para el Transporte</span>
                            <span className="block">Seguro de Minerales</span>
                        </h1>

                        {/* Description */}
                        <p
                            className={`text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed transform transition-all duration-1000 delay-500 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            Monitoreo en tiempo real, rutas optimizadas y
                            protocolos de seguridad avanzados para garantizar el
                            transporte eficiente y seguro de minerales.
                        </p>

                        {/* Buttons */}
                        <div
                            className={`flex flex-col sm:flex-row gap-4 mb-12 transform transition-all duration-1000 delay-700 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <button
                                onClick={() => scrollToSection("contact")}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 group"
                            >
                                <span className="flex items-center gap-2">
                                    Contáctanos
                                    <ChevronDown className="w-5 h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div
                            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-1000 ${
                                isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                            }`}
                        >
                            <div className="text-center md:text-left">
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    24/7
                                </div>
                                <div className="text-slate-400">
                                    Monitoreo Continuo
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    99.9%
                                </div>
                                <div className="text-slate-400">
                                    Confiabilidad
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    500+
                                </div>
                                <div className="text-slate-400">
                                    Vehículos Monitoreados
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards - Floating */}
            <div className="absolute bottom-8 right-8 hidden xl:block">
                <div
                    className={`space-y-4 transform transition-all duration-1000 delay-1200 ${
                        isVisible
                            ? "translate-x-0 opacity-100"
                            : "translate-x-10 opacity-0"
                    }`}
                >
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300 group">
                        <MapPin className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-white font-semibold text-sm">
                            GPS Tracking
                        </div>
                        <div className="text-slate-400 text-xs">
                            Ubicación precisa
                        </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300 group">
                        <BarChart3 className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-white font-semibold text-sm">
                            Analytics
                        </div>
                        <div className="text-slate-400 text-xs">
                            Datos en tiempo real
                        </div>
                    </div>
                    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700/50 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300 group">
                        <Truck className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-white font-semibold text-sm">
                            Fleet Control
                        </div>
                        <div className="text-slate-400 text-xs">
                            Gestión total
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
