import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import { UserInterface } from "@/interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import customStyles from "@/styles/StylesTable";
import React, { FormEventHandler, useState } from "react";
import DataTable from "react-data-table-component";
import { Head, router, usePage } from "@inertiajs/react";
import ModalDelete from "@/Components/Modal/ModalDelete";
import ModalFormUser from "@/Components/Modal/ModalFormUser";
import { RolesInterface } from "@/interfaces/Roles";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessages as FlashMessagesType } from "@/interfaces/FlashMessages";
import FlashMessages from "@/Components/FlashMessages";

type Props = {
    users: UserInterface[];
    roles: RolesInterface[];
};

const Index: React.FC<Props> = ({ users, roles }) => {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userIdToSelect, setUserIdToSelect] = useState<number | null>(null);
    const [confirmingUserShow, setConfirmingUserShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Indica si se está editando o creando
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const { props } = usePage();
    
    // Asegúrate de que props.flash esté definido
    const flash: FlashMessagesType = props.flash || {};
    const { error, success } = flash;

    const columns = [
        {
            name: "ID",
            cell: (row: UserInterface, index: number) => index + 1, // Enumerar filas
            width: "50px", // Ajustar el ancho de la columna si es necesario
        },
        {
            name: "Nombre Completo",
            cell: (row: UserInterface) =>
                row.nombre + " " + row.ap_pat + " " + row.ap_mat,
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
            cell: (row: UserInterface) => (row.rol),
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
                    <button onClick={() => handleEdit(row)}>
                        <i className="bi bi-eye"></i>
                    </button>
                    <button onClick={() => confirmUserDeletion(row.user_id)}>
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

    const confirmUserDeletion = (userId: number) => {
        setUserIdToSelect(userId);
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setConfirmingUserShow(false);
        setUserIdToSelect(null);
        setUserData(null); // Reinicia los datos del usuario al cerrar
        //clearErrors();
        //reset();
    };

    const deleteUser = async () => {
        if (userIdToSelect !== null) {
            await router.delete(route("user.destroy", userIdToSelect), {
                preserveScroll: true, // Mantiene la posición del scroll
                onSuccess: () => {
                    closeModal(); // Cierra el modal después de eliminar
                },
                onError: (errors) => {
                    console.error("Error al eliminar el usuario:", errors);
                },
                onFinish: () => {
                    setUserIdToSelect(null); // Limpia el estado de `userIdToSelect`
                },
            });
        } else {
            console.warn("No hay un ID de usuario seleccionado para eliminar.");
        }
    };

    return (
        <Authenticated>
            
            <Head title="Users" />
            <Breadcrumb pageName="Users" />
                <FlashMessages error={error} success={success} />
            <div className="flex justify-end my-10">
                <PrimaryButton type="button" onClick={handleCreate} className="h-10">
                    Nuevo
                </PrimaryButton>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={users} // Usar los datos de usuarios pasados como props
                    pagination // Habilitar paginación
                    //selectableRows // Habilitar selección de filas
                    //highlightOnHover // Resaltar fila al pasar el ratón
                    //pointerOnHover // Cambiar el cursor al pasar sobre la fila
                    paginationPerPage={10} // Número de filas por página
                    paginationRowsPerPageOptions={[5, 10, 20]} // Opciones para filas por página
                    customStyles={customStyles}
                    //progressPending={loanding}
                    theme="dark"
                />
            </div>
            <ModalDelete
                show={confirmingUserDeletion}
                onClose={closeModal}
                onDelete={deleteUser} // Esto pasa una función que retorna `deleteUser` en lugar de ejecutarla.
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
