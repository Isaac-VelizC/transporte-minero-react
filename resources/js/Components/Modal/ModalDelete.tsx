import React, { useState } from "react";
import Modal from "./Modal";
import SecondaryButton from "../Buttons/SecondaryButton";
import DangerButton from "../Buttons/DangerButton";

type Props = {
    show: boolean; // Prop para controlar la visibilidad del modal
    onClose: () => void; // Función para cerrar el modal
    onDelete: () => void; // Función para manejar la eliminación
};

const ModalDelete: React.FC<Props> = ({ show, onClose, onDelete }) => {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete your account?
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Please enter your password to
                    confirm you would like to permanently delete your account.
                </p>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancel
                    </SecondaryButton>

                    <DangerButton type="button" className="ms-3" onClick={onDelete}>
                        Delete Account
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalDelete;