import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { UserInterface } from "@/interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    drivers: UserInterface[];
};

export default function index({ drivers }: Props) {
    const [confirmDriverStatus, setConfirmDriverStatus] = useState(false);
    const [idToSelect, setIdToSelect] = useState<number | null>(null);
    const [status, setStatus] = useState(false);
    const columns = [
        {
            name: "#",
            cell: (_: UserInterface, index: number) => index + 1,
            width: "50px",
        },
        {
            name: "Nombre Completo",
            cell: (row: UserInterface) => row.full_name,
            sortable: true,
        },
        {
            name: "Cedula",
            cell: (row: UserInterface) => row.ci,
            sortable: true,
        },
        {
            name: "Email",
            cell: (row: UserInterface) => row.email,
            sortable: true,
        },
        {
            name: "Telefono",
            cell: (row: UserInterface) => (row.numero ? row.numero : "unknown"),
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row: UserInterface) => (
                <span
                    className={`rounded-lg px-2 font-semibold py-1 text-white ${
                        row.estado ? "bg-green-400" : "bg-red-400"
                    }`}
                >
                    {row.estado ? "Activo" : "Inactivo"}
                </span>
            ),
            width: "100px",
        },
        {
            name: "Acciones",
            cell: (row: UserInterface) => (
                <div className="flex gap-2">
                    <Link href={route("driver.edit", row.user_id)}>
                        <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                        onClick={() =>
                            confirmUserDeletion(row.user_id, row.estado)
                        }
                    >
                        <i className="bi bi-trash2"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "90px",
        },
    ];

    const confirmUserDeletion = (userId: number, estado: boolean) => {
        setStatus(estado);
        setIdToSelect(userId);
        setConfirmDriverStatus(true);
    };

    const closeModal = () => {
        setConfirmDriverStatus(false);
        setIdToSelect(null);
    };

    const deleteUser = async () => {
        if (!idToSelect) {
            toast.error("No hay un ID de usuario seleccionado para eliminar.");
            return;
        }

        try {
            await router.delete(route("user.destroy", idToSelect), {
                preserveScroll: true,
                onSuccess: ({ props: { flash } }) => {
                    //if (flash?.success) toast.success(flash.success);
                    closeModal();
                    setIdToSelect(null);
                    setStatus(false);
                },
                onError: (errors) => {
                    console.error("Error al eliminar el usuario:", errors);
                    toast.error("Ocurrió un error al eliminar el usuario.");
                },
            });
        } catch (error) {
            console.error("Error inesperado:", error);
            toast.error("Ocurrió un error inesperado.");
        }
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            // Mostrar mensaje de éxito
            toast.success(flash.success);
        }
        if (flash.error) {
            // Mostrar mensaje de error
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <Authenticated>
            <Head title="Drivers" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista de Conductores" },
                ]}
            />
            <div className="flex justify-end my-10 gap-3">
                <LinkButton href="driver.create">Crear Nuevo</LinkButton>
            </div>
            <DataTableComponent columns={columns} data={drivers} />
            <ModalDelete
                title={`¿Estás seguro de que quieres ${
                    !status ? "activar" : "desactivar"
                } tu cuenta?`}
                titleButton={!status ? "Activar" : "Desactivar"}
                show={confirmDriverStatus}
                onClose={closeModal}
                onDelete={deleteUser}
                children={
                    <p className="mt-1 text-sm text-gray-600">
                        {!status
                            ? "Al activar tu cuenta, tendrás acceso a todas las funciones y servicios disponibles. Asegúrate de que deseas continuar con este proceso. "
                            : "Al desactivar tu cuenta, perderás el acceso a todas las funciones y servicios. Si decides continuar, podrás reactivarla en cualquier momento. "}
                        Por favor, confirma tu decisión ingresando tu
                        contraseña.
                    </p>
                }
            />
        </Authenticated>
    );
}
