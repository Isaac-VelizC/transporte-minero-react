import useDeviceTracking from "@/Components/Maps/Api/userLocation";
import { createContext, useContext, useState, useEffect } from "react";

interface TrackingContextProps {
    startTracking: (envioId: number, deviceId: number) => void;
    stopTracking: () => void;
    deviceLocation: [number, number] | null;
    isTracking: boolean;
}

const TrackingContext = createContext<TrackingContextProps | undefined>(undefined);

export const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [deviceId, setDeviceId] = useState<number | null>(null);
    const [envioId, setEnvioId] = useState<number | null>(null);
    const deviceLocation = useDeviceTracking(envioId ?? 0, deviceId ?? 0);

    const startTracking = (envioId: number, deviceId: number) => {
        setEnvioId(envioId);
        setDeviceId(deviceId);
        setIsTracking(true);
    };

    const stopTracking = () => {
        setIsTracking(false);
        setEnvioId(null);
        setDeviceId(null);
    };

    return (
        <TrackingContext.Provider value={{ startTracking, stopTracking, deviceLocation, isTracking }}>
            {children}
        </TrackingContext.Provider>
    );
};

export const useTracking = () => {
    const context = useContext(TrackingContext);
    if (!context) {
        throw new Error("useTracking debe usarse dentro de un TrackingProvider");
    }
    return context;
};
