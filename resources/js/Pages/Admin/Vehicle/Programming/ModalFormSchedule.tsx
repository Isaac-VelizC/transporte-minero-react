import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import Modal from "@/Components/Modal/Modal";
import { DriverInterface } from "@/interfaces/Driver";
import { FormScheduleType } from "@/interfaces/schedule";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    show: boolean;
    onClose: () => void;
    schedule?: FormScheduleType;
    isEditing: boolean;
    id_car?: number;
};

function ModalFormSchedule({
    isEditing,
    show,
    onClose,
    schedule,
    id_car,
}: Props) {
    const initialData = schedule || {
        id: null,
        car_id: id_car,
        driver_id: null,
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);
    useEffect(() => {
        setData(initialData);
    }, [schedule, id_car]);

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

        const routeUrl =
            isEditing && data.id
                ? route("vehicle.programming.update", data.id)
                : route("vehicle.programming");

        const method = isEditing && data.id ? patch : post;

        method(routeUrl, {
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
                    {isEditing
                        ? "Editar Información"
                        : "Asignar conductor al vehiculo"}
                </h2>
                {isEditing ? (
                    <div className="py-4">
                        <strong>Conductor: </strong> {schedule?.conductor}{" "}
                    </div>
                ) : null}
                <div>
                    <InputLabel
                        htmlFor="driver_id"
                        value="Conductores disponibles"
                    />
                    <SelectInput
                        isFocused
                        className="mt-1 block w-full"
                        required={isEditing ? false : true}
                        value={data.driver_id || ""}
                        onChange={(e) =>
                            setData("driver_id", parseInt(e.target.value))
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

export default ModalFormSchedule;
