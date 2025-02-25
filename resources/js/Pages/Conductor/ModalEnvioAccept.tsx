import DangerButton from "@/Components/Buttons/DangerButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import Modal from "@/Components/Modal/Modal";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { router, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

type Props = {
    showModal: boolean;
    cargaData: ShipmentInterface;
    vehicleId?: number | null;
    closeModal: () => void
};

export default function ModalEnvioAccept({ showModal, vehicleId, closeModal, cargaData }: Props) {
    const initialData = {
        message: "",
        vehicle: vehicleId,
        envio: cargaData?.id,
    };

    const { data, setData, post, errors } = useForm(initialData);

    const handleConfirm = async () => {
        if (cargaData !== null) {
            try {
                // Realiza la solicitud para cambiar el estado del envío
                await router.get(route("driver.envios.status", cargaData.id));
            } catch (error) {
                toast.error("Error al cambiar el estado del envío");
            }
        } else {
            toast.error(
                "No hay un ID de envío seleccionado para cambiar el estado."
            );
        }
    };

    const handleCancelarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.envio !== null && data.vehicle !== null) {
            try {
                data.envio = cargaData?.id;
                // Realiza la solicitud para cambiar el estado del envío
                post(route("driver.envios.renuncia"), {
                    onSuccess: ({ props: { flash } }) => {
                        if (flash.success) toast.success(flash.success);
                    }
                });
                //toast.success("El estado del envío ha sido cambiado exitosamente.");
            } catch (error) {
                console.error("Error al cambiar el estado del envío:", error);
                toast.error("Error al cambiar el estado del envío");
            }
        } else {
            toast.error(
                "No hay un ID de envío seleccionado para cambiar el estado."
            );
        }
    };

    return (
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h3 className="font-medium text-base text-gray-900">
                        Datos de la carga
                    </h3>
                    <div className="py-2 pl-4 space-y-1">
                        <p>
                            <strong>Origen: </strong>
                            {cargaData?.origen}
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {cargaData?.destino}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {cargaData?.fecha_entrega}
                        </p>
                    </div>
                    <form onSubmit={handleCancelarEnvio}>
                        <p className="text-orange-400">
                            Si renuncias, menciona del porque
                        </p>
                        <div>
                            <InputLabel
                                htmlFor="message"
                                value="Descripcion Corta"
                            />
                            <textarea
                                id="message"
                                rows={4}
                                className="mt-1 block w-full rounded-md"
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                value={data.message}
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.message}
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <DangerButton
                                type="button"
                                className="mt-4"
                                onClick={closeModal}
                            >
                                Cerrar
                            </DangerButton>
                            {cargaData?.status !== "pendiente" &&
                            vehicleId ? null : (
                                <>
                                    <PrimaryButton
                                        type="button"
                                        className="mt-4"
                                        onClick={handleConfirm}
                                    >
                                        Aceptar Carga
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="submit"
                                        className="mt-4"
                                    >
                                        Renunciar al envio
                                    </SecondaryButton>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>
    );
}
