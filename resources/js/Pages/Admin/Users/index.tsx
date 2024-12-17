import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import { UserInterface } from "@/interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ModalDelete from "@/Components/Modal/ModalDelete";
import ModalFormUser from "@/Pages/Admin/Users/ModalFormUser";
import { RolesInterface } from "@/interfaces/Roles";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import LinkButton from "@/Components/Buttons/LinkButton";

type Props = {
    users: UserInterface[];
    roles: RolesInterface[];
};

const Index: React.FC<Props> = ({ users, roles }) => {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userIdToSelect, setUserIdToSelect] = useState<number | null>(null);
    const [confirmingUserShow, setConfirmingUserShow] = useState(false);
    const [status, setStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserInterface | null>(null);

    const columns = [
        {
            name: "#",
            cell: (row: UserInterface, index: number) => index + 1,
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
            name: "Rol",
            cell: (row: UserInterface) => row.rol,
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
                    {row.rol == "Conductor" ? (
                        <Link href={route("driver.edit", row.user_id)}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                    ) : (
                        <button onClick={() => handleEdit(row)}>
                            <i className="bi bi-eye"></i>
                        </button>
                    )}
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

    const handleEdit = (row: UserInterface) => {
        setIsEditing(true);
        setUserData(row);
        setConfirmingUserShow(true);
    };

    const handleCreate = () => {
        setIsEditing(false);
        setUserData(null);
        setConfirmingUserShow(true);
    };

    const confirmUserDeletion = (userId: number, estado: boolean) => {
        setStatus(estado);
        setUserIdToSelect(userId);
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setConfirmingUserShow(false);
        setUserIdToSelect(null);
        setUserData(null);
    };

    const deleteUser = async () => {
        if (userIdToSelect !== null) {
            await router.delete(route("user.destroy", userIdToSelect), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error("Error al eliminar el usuario:", errors);
                },
                onFinish: () => {
                    setUserIdToSelect(null);
                },
            });
            setStatus(false);
        } else {
            console.warn("No hay un ID de usuario seleccionado para eliminar.");
        }
    };

    return (
        <Authenticated>
            <Head title="Users" />
            <Breadcrumb pageName="Users" />
            <div className="flex justify-end my-10 gap-3">
                <LinkButton href="driver.create">
                    <i className="bi bi-person-plus text-sm" />
                    Conductor
                </LinkButton>
                <PrimaryButton type="button" onClick={handleCreate}>
                    Nuevo
                </PrimaryButton>
            </div>
            <DataTableComponent columns={columns} data={users} />
            <ModalDelete
                title={`¿Estás seguro de que quieres ${
                    !status ? "activar" : "desactivar"
                } tu cuenta?`}
                titleButton={!status ? "Activar" : "Desactivar"}
                show={confirmingUserDeletion}
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
                show={confirmingUserShow}
                onClose={closeModal}
                users={userData || undefined} // Pasa datos del usuario si existen
                isEditing={isEditing}
                roles={roles}
            />
        </Authenticated>
    );
};

export default Index;
