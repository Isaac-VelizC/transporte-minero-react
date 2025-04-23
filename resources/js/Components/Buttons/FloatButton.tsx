import React from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

const downloadBackup = async () => {
    try {
        const response = await axios.get(route("backup.download"), {
            responseType: "blob",
            withCredentials: true,
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "backup.sql.zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error descargando backup:", error);
    }
};

const FloatingBackupButton: React.FC = () => {
    return (
        <button
            onClick={downloadBackup}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 z-50"
            title="Descargar respaldo"
        >
            <i className="bi bi-cloud-arrow-down"></i>
        </button>
    );
};

export default FloatingBackupButton;
