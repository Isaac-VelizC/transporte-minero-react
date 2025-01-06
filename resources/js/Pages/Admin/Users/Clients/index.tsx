import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ModalFormUser from "../ModalFormUser";
import toast from "react-hot-toast";
import { PersonaInterface } from "@/interfaces/Persona";

type Props = {
    clientes: PersonaInterface[];
};

const Index = ({ clientes }: Props) => {
    const [confirmClientStatus, setConfirmClientStatus] = useState(false);
    const [userIdToSelect, setUserIdToSelect] = useState<number | null>(null);
    const [showModalForm, setShowModalForm] = useState(false);
    const [status, setStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<formUserType | null>(null);

    const handleEdit = useCallback(
        (row: PersonaInterface) => {
            if (!row || !row.user) {
                toast.error('Error al tratar de editar la Información');
                return;
            }

            setIsEditing(true);

            const data = {
                id: row.id,
                user_id: row.user.id,
                nombre: row.nombre || "",
                ap_pat: row.ap_pat || "",
                ap_mat: row.ap_mat || "",
                email: row.user.email || "",
                ci: row.ci || "",
                genero: row.genero || "",
                numero: row.numero || "",
                rol: row.rol || "",
            };

            setUserData(data);
            setShowModalForm(true);
        },
        [setUserData, setShowModalForm]
    );

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

    const renderAcciones = (row: PersonaInterface) => (
        <div className="flex gap-2">
            <Link href={route("client.history.list", row.id)}>
                <i className="bi bi-card-checklist"></i>
            </Link>
            <button onClick={() => handleEdit(row)}>
                <i className="bi bi-eye"></i>
            </button>
            <button
                onClick={() => confirmUserDeletion(row.user.id, row.estado)}
            >
                <i className="bi bi-trash2"></i>
            </button>
        </div>
    );

    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (_: PersonaInterface, index: number) => index + 1,
                width: "50px",
            },
            {
                name: "Nombre Completo",
                cell: (row: PersonaInterface) =>
                    row.nombre + " " + row.ap_pat + " " + row.ap_mat,
                sortable: true,
            },
            {
                name: "Cedula",
                cell: (row: PersonaInterface) => row.ci,
                sortable: true,
            },
            {
                name: "Email",
                cell: (row: PersonaInterface) => row.user.email,
                sortable: true,
            },
            {
                name: "Telefono",
                cell: (row: PersonaInterface) =>
                    row.numero ? row.numero : "unknown",
            },
            {
                name: "Estado",
                cell: (row: PersonaInterface) => renderEstado(row.estado),
                width: "100px",
            },
            {
                name: "Acciones",
                cell: (row: PersonaInterface) => renderAcciones(row),
                ignoreRowClick: true,
                width: "90px",
            },
        ],
        []
    );

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
                    if (flash?.error) toast.success(flash.error);
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
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <Authenticated>
            <Head title="Clientes" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista Clientes" },
                ]}
            />
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
