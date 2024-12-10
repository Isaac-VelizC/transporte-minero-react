import React, { useEffect, useState } from "react";

interface FlashMessagesProps {
    error?: string;
    success?: string;
}

const FlashMessages: React.FC<FlashMessagesProps> = ({ error, success }) => {
    const [visibleMessage, setVisibleMessage] = useState<string | null>(null);

    useEffect(() => {
        // Si hay un mensaje de error o éxito, mostrarlo
        if (error) {
            setVisibleMessage(error);
        } else if (success) {
            setVisibleMessage(success);
        }
        console.log(visibleMessage);
        
        // Si hay un mensaje visible, configurar el temporizador
        if (visibleMessage) {
            const timer = setTimeout(() => setVisibleMessage(null), 3000);
            return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
        }
    }, [error, success, visibleMessage]);

    if (!visibleMessage) return null; // No mostrar nada si no hay mensaje visible

    return (
        <div className="fixed top-5 right-5 space-y-4 z-50">
            <div className={`px-4 py-2 rounded shadow-md ${error ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                {visibleMessage}
            </div>
        </div>
    );
};

export default FlashMessages;