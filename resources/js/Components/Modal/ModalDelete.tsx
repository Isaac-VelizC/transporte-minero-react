import React, { ReactNode, useState } from "react";
import Modal from "./Modal";
import SecondaryButton from "../Buttons/SecondaryButton";
import DangerButton from "../Buttons/DangerButton";

type Props = {
    show: boolean; // Prop para controlar la visibilidad del modal
    onClose: () => void; // Función para cerrar el modal
    onDelete: () => void; // Función para manejar la eliminación
    title: string;
    children?: ReactNode;
    titleButton: string;
};

const ModalDelete: React.FC<Props> = ({
    show,
    onClose,
    onDelete,
    title,
    titleButton,
    children,
}) => {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>

                {children}

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancel
                    </SecondaryButton>

                    <DangerButton
                        type="button"
                        className="ms-3"
                        onClick={onDelete}
                    >
                        {titleButton}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalDelete;
