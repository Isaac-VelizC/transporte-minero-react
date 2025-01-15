import DangerButton from "@/Components/Buttons/DangerButton";
import Modal from "@/Components/Modal/Modal";
type Props = {
    show: boolean;
    onClose: () => void;
    conductor: string;
    telefono: string;
};

const ModalAlerta = ({ show, onClose, conductor, telefono }: Props) => {
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
                <div className="grid grid-cols-2">
                    <h3>
                        <strong>Conductor/a</strong>
                        <p>{conductor}</p>
                    </h3>
                    <h3>
                        <strong>Telefono</strong>
                        <p>{telefono}</p>
                    </h3>
                </div>
                <DangerButton type="button" onClick={onClose}>
                    Aceptar
                </DangerButton>
            </div>
        </Modal>
    );
};

export default ModalAlerta;
