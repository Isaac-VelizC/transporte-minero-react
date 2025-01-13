import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import ModalDelete from "@/Components/Modal/ModalDelete";
import ModalFormUser from "@/Pages/Admin/Users/ModalFormUser";
import { RolesInterface } from "@/interfaces/Roles";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import LinkButton from "@/Components/Buttons/LinkButton";
import toast from "react-hot-toast";
import ModalPassword from "./ModalPassword";
import { PersonaInterface } from "@/interfaces/Persona";

type Props = {
    users: PersonaInterface[];
    roles: RolesInterface[];
};

const Index: React.FC<Props> = ({ users, roles }) => {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userIdToSelect, setUserIdToSelect] = useState<number | null>(null);
    const [confirmingUserShow, setConfirmingUserShow] = useState(false);
    const [modalUpdatePassword, setModalUpdatePassword] = useState(false);
    const [status, setStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<PersonaInterface | null>(null);

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
                sortable: true,
            },
            {
                name: "Rol",
                cell: (row: PersonaInterface) => row.rol,
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: PersonaInterface) => (
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
                cell: (row: PersonaInterface) => (
                    <div className="flex gap-2">
                        <button onClick={() => handlePasswordModal(row)}>
                            <i className="bi bi-shield-lock"></i>
                        </button>
                        <button
                            onClick={() =>
                                confirmUserDeletion(row.id, row.estado)
                            }
                        >
                            <i className="bi bi-trash2"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
                width: "90px",
            },
        ],
        []
    );

    const handlePasswordModal = (row: PersonaInterface) => {
        setModalUpdatePassword(true);
        setUserData(row);
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
        setModalUpdatePassword(false);
        setUserIdToSelect(null);
        setUserData(null);
    };

    const deleteUser = async () => {
        if (userIdToSelect === null) {
            toast.error("No hay un ID de usuario seleccionado para eliminar.");
            return;
        }
        try {
            await router.delete(route("user.destroy", userIdToSelect), {
                preserveScroll: true,
            });
            closeModal();
        } catch (errors) {
            toast.error("Error al eliminar el usuario");
        } finally {
            setUserIdToSelect(null);
            setStatus(false);
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
            <Head title="Users" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Users" },
                ]}
            />
            <div className="flex justify-between my-10">
                <div className="flex gap-3">
                    <LinkButton href="clients.list">Clientes</LinkButton>
                    <LinkButton href="drivers.list">Conductores</LinkButton>
                </div>
                <PrimaryButton type="button" onClick={handleCreate} className="gap-2">
                    <i className="bi bi-person-plus text-sm" />
                    <p className="hidden lg:block text-white text-sm">Personal</p>
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
            <ModalPassword
                show={modalUpdatePassword}
                onClose={closeModal}
                user={userData!}
            />
            <ModalFormUser
                rutaName="user"
                show={confirmingUserShow}
                onClose={closeModal}
                //users={userData || undefined}
                isEditing={isEditing}
                roles={roles}
            />
        </Authenticated>
    );
};

export default Index;
