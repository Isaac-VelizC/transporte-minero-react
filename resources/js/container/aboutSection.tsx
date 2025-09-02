

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Award, Shield, Truck, Users } from 'lucide-react';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
    <div className="bg-slate-50">
      {/* About Area Start */}
      <div 
        id="about" 
        className="mx-4 my-10 lg:my-24"
        ref={sectionRef}
      >
        <div className="container lg:mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            
            {/* Image Section */}
            <div className="md:w-3/4 lg:w-2/5">
              <div className={`about-img relative transform transition-all duration-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>
                {/* Decorative Background */}
                <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl -z-10"></div>
                
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Company Overview"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">15+</div>
                      <div className="text-sm text-slate-600">Años de Experiencia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/4">
              <div className={`about-content transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Users className="w-4 h-4" />
                  Sobre Nosotros
                </div>

                {/* Main Title */}
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  ¿Quiénes <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Somos?</span>
                </h2>

                {/* Description Paragraphs */}
                <div className="space-y-4 text-slate-600 text-lg leading-relaxed mb-8">
                  <p>
                    La empresa de transporte <strong className="text-slate-900">Benjamin S.R.L.</strong> somos 
                    líderes en la industria minera, dedicados a la extracción y transporte de minerales 
                    de alta calidad. Con más de <strong className="text-amber-600">15 años</strong> de experiencia 
                    en el sector, nos comprometemos a ofrecer soluciones eficientes y sostenibles a nuestros clientes.
                  </p>
                  <p>
                    Nuestra misión es proporcionar minerales esenciales para el desarrollo industrial, 
                    garantizando un proceso seguro y responsable. Valoramos la transparencia y la ética 
                    en todas nuestras operaciones, lo que nos ha permitido construir relaciones sólidas 
                    con nuestros socios comerciales.
                  </p>
                </div>

                {/* Key Points */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group">
                    <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      Comprometidos con la sostenibilidad ambiental.
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3 group">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      Innovación en cada etapa del proceso.
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3 group">
                    <div className="bg-amber-100 p-2 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
                      <Truck className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      Calidad y seguridad como nuestras prioridades.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 text-center transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">500+</div>
              <div className="text-slate-400">Vehículos Monitoreados</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">15+</div>
              <div className="text-slate-400">Años de Experiencia</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">99.9%</div>
              <div className="text-slate-400">Uptime del Sistema</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">24/7</div>
              <div className="text-slate-400">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Area End */}
    </div>
  );
}