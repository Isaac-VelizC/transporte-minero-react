import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { UserInterface } from "@/interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import ModalFormUser from "../ModalFormUser";
import toast from "react-hot-toast";

type Props = {
    clientes: UserInterface[];
};

const Index = ({ clientes }: Props) => {
    const [confirmClientStatus, setConfirmClientStatus] = useState(false);
    const [userIdToSelect, setUserIdToSelect] = useState<number | null>(null);
    const [showModalForm, setShowModalForm] = useState(false);
    const [status, setStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserInterface | null>(null);

    const handleEdit = useCallback((row: UserInterface) => {
        setIsEditing(true);
        setUserData(row);
        setShowModalForm(true);
    }, []);

    const handleCreate = useCallback(() => {
        setIsEditing(false);
        setUserData(null);
        setShowModalForm(true);
    }, []);

    const confirmUserDeletion = useCallback(
        (userId: number, estado: boolean) => {
            setConfirmClientStatus(true);
            setUserIdToSelect(userId);
            setStatus(estado);
        },
        []
    );

    const renderEstado = (estado: boolean) => (
        <span
            className={`rounded-lg px-2 font-semibold py-1 text-white ${
                estado ? "bg-green-400" : "bg-red-400"
            }`}
        >
            {estado ? "Activo" : "Inactivo"}
        </span>
    );

    const renderAcciones = (row: UserInterface) => (
        <div className="flex gap-2">
            <Link href={route("client.history.list", row.id)}>
                <i className="bi bi-card-checklist"></i>
            </Link>
            <button onClick={() => handleEdit(row)}>
                <i className="bi bi-eye"></i>
            </button>
            <button
                onClick={() => confirmUserDeletion(row.user_id, row.estado)}
            >
                <i className="bi bi-trash2"></i>
            </button>
        </div>
    );

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
            cell: (row: UserInterface) => renderEstado(row.estado),
            width: "100px",
        },
        {
            name: "Acciones",
            cell: (row: UserInterface) => renderAcciones(row),
            ignoreRowClick: true,
            width: "90px",
        },
    ];

    const closeModal = () => {
        setConfirmClientStatus(false);
        setShowModalForm(false);
        setUserIdToSelect(null);
        setUserData(null);
    };

    const deleteUser = async () => {
        if (!userIdToSelect) {
            toast.error("No hay un ID de usuario seleccionado para eliminar.");
            return;
        }

        try {
            await router.delete(route("user.destroy", userIdToSelect), {
                preserveScroll: true,
                onSuccess: ({ props: { flash } }) => {
                    //if (flash?.success) toast.success(flash.success);
                    closeModal();
                    setUserIdToSelect(null);
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
            <Head title="Cientes" />
            <Breadcrumb pageName="List Clientes" />
            <div className="flex justify-end my-10 gap-3">
                <PrimaryButton type="button" onClick={handleCreate}>
                    Nuevo
                </PrimaryButton>
            </div>
            <DataTableComponent columns={columns} data={clientes} />
            <ModalDelete
                title={`¿Estás seguro de que quieres ${
                    !status ? "activar" : "desactivar"
                } tu cuenta?`}
                titleButton={!status ? "Activar" : "Desactivar"}
                show={confirmClientStatus}
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

            <ModalFormUser
                rutaName="client"
                show={showModalForm}
                onClose={closeModal}
                users={userData || undefined}
                isEditing={isEditing}
            />
        </Authenticated>
    );
};

export default Index;
