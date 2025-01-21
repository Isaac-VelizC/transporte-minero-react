import DangerButton from "@/Components/Buttons/DangerButton";
import Modal from "@/Components/Modal/Modal";
type Props = {
    show: boolean;
    onClose: () => void;
};

const ModalAlerta = ({ show, onClose }: Props) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-4 text-center space-y-10">
                <h1 className="text-red text-sm font-bold">
                    ¡El dispositivo está fuera de la geocerca!
                </h1>
                <div className="flex justify-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/559/559375.png"
                        alt="Alerta"
                        width={80}
                    />
                </div>
                
                <DangerButton type="button" onClick={onClose}>
                    Aceptar
                </DangerButton>
            </div>
        </Modal>
    );
};

export default ModalAlerta;
