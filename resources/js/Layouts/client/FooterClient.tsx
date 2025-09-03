import React, { useState, useRef, useEffect } from 'react';
import { Heart, Truck, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function FooterClient() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-[#142440]">
      {/* Main Footer */}
      <div className="py-16 border-b border-slate-700/50" ref={sectionRef}>
        <div className="container mx-auto px-4">
          
          {/* Footer Content Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                    MiningTrack
                  </h1>
                  <p className="text-xs text-slate-400 -mt-1">by Benjamin S.R.L.</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
                Líderes en monitoreo y transporte seguro de minerales con tecnología 
                de vanguardia y más de 15 años de experiencia en el sector.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-4">
                {[
                  { icon: Facebook, color: 'hover:bg-blue-600' },
                  { icon: Twitter, color: 'hover:bg-sky-500' },
                  { icon: Linkedin, color: 'hover:bg-blue-700' },
                  { icon: Instagram, color: 'hover:bg-pink-600' }
                ].map((social, index) => (
                  <button 
                    key={index}
                    className={`bg-slate-700/50 ${social.color} p-3 rounded-xl text-white hover:scale-110 transition-all duration-300`}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Contacto Rápido</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors duration-300 group">
                  <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+591 2 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors duration-300 group">
                  <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info@benjaminSRL.com</span>
                </div>
                <div className="flex items-start gap-3 text-slate-300 hover:text-amber-400 transition-colors duration-300 group">
                  <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-amber-500/20 transition-colors duration-300 mt-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Av. Camacho #1234<br />Potosí, Bolivia</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Enlaces Rápidos</h3>
              <div className="space-y-3">
                {['Servicios', 'Sobre Nosotros', 'Monitoreo GPS', 'Soporte Técnico', 'Política de Privacidad'].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="block text-slate-300 hover:text-amber-400 duration-300 hover:translate-x-2 transform transition-transform"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="py-7">
        <div className="container mx-auto px-4">
          <div className={`text-center transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <span className="text-slate-300 text-base">
              Copyright &copy; {new Date().getFullYear()}{" "}
              Todos los derechos reservados | Hecho con{" "}
              <Heart 
                className="inline w-4 h-4 text-red-500 mx-1 animate-pulse" 
                fill="currentColor"
              />{" "}
              por{" "}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline hover:no-underline transition-all duration-300 font-semibold"
              >
                Transportes Benjamín S.R.L.
              </a>
            </span>

            {/* Additional Links */}
            <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Términos de Servicio
              </a>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Política de Privacidad
              </a>
              <span className="text-slate-600">|</span>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>
    </div>
  );
}