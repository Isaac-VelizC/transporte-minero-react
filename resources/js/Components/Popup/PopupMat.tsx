import { VehicleInterface } from "@/interfaces/Vehicle";
import React from "react";

type Props = {
    vehicle: VehicleInterface;
    time: string;
    envio: {
        mineral: string
        peso: string;
    };
};

const PopupMat: React.FC<Props> = ({ time, vehicle, envio }) => {
    return (
        <div className="w-64 bg-white shadow-lg rounded-2xl p-4 text-gray-800 border border-gray-200">
            {/* Imagen del vehículo */}
            <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                <img
                    src={`${import.meta.env.VITE_URL_STORAGE}/${vehicle.image}`}
                    alt="Vehiculo"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Matricula */}
            <h1 className="text-lg font-semibold text-gray-900">
                🚗 Matrícula: {vehicle.matricula}
            </h1>

            {/* Tiempo */}
            <p className="text-sm mt-1">
                ⏱ Llega en:{" "}
                {time === "" ? (
                    <span className="text-red-500 font-medium">Calculando...</span>
                ) : (
                    <span className="text-green-600 font-semibold">{time}</span>
                )}
            </p>

            {/* Conductor */}
            <p className="text-sm mt-1">
                👨‍✈️ Conductor:{" "}
                <span className="font-medium">
                    {vehicle?.driver?.nombre} {vehicle?.driver?.ap_pat}{" "}
                    {vehicle?.driver?.ap_mat}
                </span>
            </p>

            {/* Carga */}
            <p className="text-sm mt-1">
                ⚒️ Carga:{" "}
                <span className="font-medium">
                    {envio.mineral} {envio.peso}t
                </span>
            </p>
        </div>
    );
};

export default PopupMat;
