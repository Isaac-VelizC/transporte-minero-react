import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Truck, Shield, BarChart3, Clock, ArrowRight } from 'lucide-react';

type PropsCard = {
    icon: ReactNode;
    title: string;
    description: string;
    delay: number;
}

// Card Service Component
const CardService: React.FC<PropsCard> = ({ icon, title, description, delay = 0 }) => {
  return (
    <div 
      className={`w-full md:w-1/2 lg:w-1/3 px-4 mb-8 transform transition-all duration-1000`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group border border-slate-200 hover:border-amber-200 h-full">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-4 transition-all duration-300">
          <span>Saber más</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default function ServiceSection() {
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

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-white" />,
      title: "Transporte Terrestre",
      description: "Transporte seguro y eficiente de minerales con vehículos especializados y tecnología de monitoreo en tiempo real."
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Seguridad Integral",
      description: "Protocolos de seguridad avanzados y seguros especializados para garantizar la integridad de sus minerales."
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: "Soporte 24/7",
      description: "Atención y monitoreo continuo las 24 horas del día, los 7 días de la semana para total tranquilidad."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <div 
        id="service" 
        className="service-area service-s2 px-4 py-16 lg:py-24"
        ref={sectionRef}
      >
        <div className="container mx-auto">
          
          {/* Section Header */}
          <div className="w-full mb-16">
            <div className={`section-title text-center transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-2 rounded-full text-sm font-medium mb-4">
                <BarChart3 className="w-4 h-4" />
                Brindamos lo mejor
              </div>
              
              {/* Main Title */}
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                Nuestros <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Servicios</span>
              </h2>
              
              {/* Subtitle */}
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Ofrecemos soluciones integrales para el transporte y monitoreo de minerales, 
                con tecnología de vanguardia y un equipo especializado.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="services-area">
            <div className="container">
              <div className={`flex flex-wrap -mx-4 transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                {services.map((service, index) => (
                  <CardService
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    delay={index * 200}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Process Section */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-3xl font-bold text-white mb-4">Nuestro Proceso</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Un flujo de trabajo optimizado para garantizar la máxima eficiencia y seguridad
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {[
              { step: "01", title: "Planificación", desc: "Análisis de ruta y logística" },
              { step: "02", title: "Preparación", desc: "Acondicionamiento del vehículo" },
              { step: "03", title: "Monitoreo", desc: "Seguimiento en tiempo real" },
              { step: "04", title: "Entrega", desc: "Confirmación de llegada segura" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}