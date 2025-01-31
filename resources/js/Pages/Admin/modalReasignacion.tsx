import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import Modal from "@/Components/Modal/Modal";
import { DriverInterface } from "@/interfaces/Driver";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    show: boolean;
    onClose: () => void;
    id_car?: number | null;
    id_renuncia: number | null;
};

function ModalReasignacion({ show, onClose, id_car, id_renuncia }: Props) {
    const initialData = {
        car_id: id_car,
        driver_id: "",
    };

    const { data, setData, post, errors, processing, reset } =
        useForm(initialData);

    const [availableDrivers, setAvailableDrivers] = useState<DriverInterface[]>(
        []
    );

    const fetchAvailableResources = async () => {
        try {
            const response = await fetch(`/api/available-resources`);
            const result = await response.json();
            setAvailableDrivers(result.drivers);
        } catch (error) {
            console.error("Error fetching available resources:", error);
        }
    };
    // Solo ejecutar cuando cambian las fechas
    useEffect(() => {
        fetchAvailableResources();
    }, [data.driver_id]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        data.car_id = id_car
        post(route("vehicle.programming.reasignacion", id_renuncia!), {
            onSuccess: ({ props: { flash } }) => {
                if (flash?.error) toast.error(flash.error);
                hancleCloseModal();
                reset();
            },
        });
    };

    const hancleCloseModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-2">
                    Reasignar conductor al vehiculo
                </h2>
                <div>
                    <InputLabel
                        htmlFor="driver_id"
                        value="Conductores disponibles"
                    />
                    <SelectInput
                        isFocused
                        className="mt-1 block w-full"
                        required
                        value={data.driver_id || ""}
                        onChange={(e) =>
                            setData("driver_id", e.target.value)
                        }
                    >
                        <option value="" disabled>
                            {availableDrivers.length > 0
                                ? "Selecciona Conductor"
                                : "No hay datos disponibles"}
                        </option>
                        {availableDrivers.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.persona.nombre +
                                    " " +
                                    item.persona.ap_pat}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.driver_id} />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={hancleCloseModal}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton
                        type="submit"
                        className="ms-3"
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Guardar"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default ModalReasignacion;
