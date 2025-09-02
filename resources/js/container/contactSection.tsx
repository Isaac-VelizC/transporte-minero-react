import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Globe } from 'lucide-react';

export default function ContactSection() {
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

  const contactCards = [
    {
      icon: MapPin,
      title: "Dirección",
      info: ["Av. Camacho #1234, Edificio Central", "La Paz, Bolivia"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Teléfono",
      info: ["+591 2 123-4567", "+591 7 890-1234"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      info: ["info@benjaminSRL.com", "soporte@benjaminSRL.com"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="bg-[#142440]">
      <div 
        id="contact" 
        className="py-16 lg:py-24 border-b border-slate-700/50 px-4"
        ref={sectionRef}
      >
        <div className="container mx-auto">
          
          {/* Section Header */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-2 mb-6">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm font-medium">Contáctanos</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl mb-6 font-bold text-white">
              Nuestros <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Contactos</span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios 
              y nuestro equipo te responderá a la brevedad.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactCards.map((card, index) => (
              <div 
                key={index}
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 hover:border-amber-400/50 transition-all duration-500 group h-full">
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className={`relative bg-gradient-to-r ${card.color} p-4 rounded-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl mb-4 text-white font-semibold group-hover:text-amber-400 transition-colors duration-300">
                    {card.title}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {card.info.map((item, infoIndex) => (
                      <div 
                        key={infoIndex}
                        className="text-slate-300 hover:text-white transition-colors duration-300 cursor-pointer group-hover:text-amber-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}