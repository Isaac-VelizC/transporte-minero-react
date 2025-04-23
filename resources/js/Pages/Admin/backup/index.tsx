import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { useMemo } from "react";

interface FilesBackups {
    code: string;
    nombre: string;
    fecha: string;
    [key: string]: unknown;
}

type Props = {
    backups: FilesBackups[];
};

export default function index({ backups }: Props) {
    const columns = useMemo(
        () => [
            {
                name: "Número",
                cell: (row: FilesBackups) => row.code,
            },
            {
                name: "Nombre",
                cell: (row: FilesBackups) => row.nombre,
                sortable: true,
            },
            {
                name: "Fecha",
                cell: (row: FilesBackups) => row.fecha,
            },
            {
                name: "Acciones",
                cell: (row: FilesBackups) => (
                    <button onClick={() => handleDownload(row.code)}>
                        <i className="bi bi-cloud-download"></i>
                    </button>
                ),
                ignoreRowClick: true,
            }
        ],
        []
    );

    const handleDownload = async (file: string) => {
        try {
            const response = await axios.get(route('backup.download', { file }), {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al descargar el backup:", error);
            alert("No se pudo descargar el archivo.");
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post(route('backup.run'));
            alert(response.data.message);
            router.reload(); // recarga la tabla automáticamente
        } catch (error: any) {
            console.error("Error al crear backup:", error);
            alert(error.response?.data?.message || "Error al crear el backup.");
        }
    };

    return (
        <Authenticated>
            <Head title="Copia de seguridad" />
            <div className="flex justify-end my-10 gap-3">
                <PrimaryButton type="button" onClick={handleCreate}>
                    Nuevo Copia
                </PrimaryButton>
            </div>
            <DataTableComponent columns={columns} data={backups} />
        </Authenticated>
    );
}
