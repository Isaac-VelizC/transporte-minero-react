import DangerButton from "@/Components/Buttons/DangerButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Modal from "@/Components/Modal/Modal";
import { UserInterface } from "@/interfaces/User";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    show: boolean; // Prop para controlar la visibilidad del modal
    onClose: () => void; // Función para cerrar el modal
    user: UserInterface;
};

const ModalPassword: React.FC<Props> = ({ show, onClose, user }) => {
    //const [password, setPassword] = useState(""); // Estado para la contraseña
    //const [error, setError] = useState(""); // Estado para los errores

    const handleResetPassword = async () => {
        if (user.id === null) {
            toast.error("No hay un ID de usuario seleccionado para eliminar.");
            return;
        }
        try {
            await router.get(route("user.password.restore", user.id), {
                preserveScroll: true,
                /*onSuccess: ({ props: { flash } }) => {
                    if (flash?.success) toast.success(flash.success);
                    if (flash?.success) toast.success(flash.success);
                },
                onError: (errors) => {
                    toast.error(
                        "Error al reestablecer la contraseña del usuario:",
                        errors
                    );
                },*/
            });
            onClose();
        } catch (errors) {
            toast.error("Error al reestablecer la contraseña del usuario");
        } finally {
        }
        /*if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }*/

        // Limpiar estado y cerrar modal
        //setPassword("");
        //setError("");
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Restablecer Contraseña
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ingrese la nueva contraseña para el usuario{" "}
                    <strong>
                        {user && user.full_name} - {user && user.ci}
                    </strong>
                </p>

                {/*<div className="mt-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        placeholder="Nueva contraseña"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>*/}

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>

                    <DangerButton
                        type="button"
                        className="ms-3"
                        onClick={handleResetPassword}
                    >
                        Restablecer
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalPassword;
