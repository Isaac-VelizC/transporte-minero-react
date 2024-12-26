import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import { MantenimientoInterface } from "@/interfaces/Mantenimiento";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    show: boolean;
    onClose: () => void;
    infoData?: MantenimientoInterface;
    cardId: number;
    isEditing: boolean;
};

function ModalFormMantenimieto({
    isEditing,
    show,
    onClose,
    infoData,
    cardId,
}: Props) {
    const initialData = infoData || {
        id: null,
        vehicle_id: cardId,
        fecha: "",
        observaciones: "",
    };

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [infoData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const action = isEditing && data.id ? patch : post;
        const routeName =
            isEditing && data.id
                ? "mantenimiento.update"
                : "mantenimiento.store";
        action(route(routeName, `${data?.id}`), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-200 mb-2">
                    {isEditing
                        ? "Editar Información"
                        : "Programar Mantenimiento"}
                </h2>
                <div>
                    <InputLabel
                        htmlFor="fecha"
                        value="Fecha de mantenimiento"
                    />
                    <TextInput
                        id="fecha"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.fecha}
                        onChange={(e) => setData("fecha", e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.fecha} />
                </div>
                <div>
                    <InputLabel htmlFor="observaciones" value="Observaciones" />
                    <textarea
                        id="observaciones"
                        rows={4}
                        className="mt-1 block w-full rounded-md"
                        onChange={(e) =>
                            setData("observaciones", e.target.value)
                        }
                        value={data.observaciones}
                    />
                    <InputError
                        className="mt-2"
                        message={errors.observaciones}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton
                        type="submit"
                        className="ms-3"
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Registrar"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default ModalFormMantenimieto;
