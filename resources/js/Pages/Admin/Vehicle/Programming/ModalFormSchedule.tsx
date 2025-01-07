import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import { DriverInterface } from "@/interfaces/Driver";
import { FormScheduleType } from "@/interfaces/schedule";
import { VehicleInterface } from "@/interfaces/Vehicle";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    show: boolean;
    onClose: () => void;
    schedule?: FormScheduleType;
    isEditing: boolean;
};

function ModalFormSchedule({ isEditing, show, onClose, schedule }: Props) {
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 16);

    const initialData = schedule || {
        id: null,
        car_id: null,
        start_time: "",
        end_time: "",
        driver_id: null,
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [schedule]);

    const [availableDrivers, setAvailableDrivers] = useState<DriverInterface[]>(
        []
    );
    const [availableVehicles, setAvailableVehicles] = useState<
        VehicleInterface[]
    >([]);

    const fetchAvailableResources = async () => {
        if (data.start_time && data.end_time) {
            try {
                // Construir dinámicamente la URL
                const params = new URLSearchParams({
                    start_time: data.start_time,
                    end_time: data.end_time,
                });
                // Solo agregar car_id y driver_id si están definidos
                if (data.driver_id) {
                    params.append("driver_id", data.driver_id.toString());
                }
                if (data.car_id) {
                    params.append("car_id", data.car_id.toString());
                }
                const response = await fetch(`/api/available-resources?${params.toString()}`);
                const result = await response.json();
                setAvailableDrivers(result.drivers);
                setAvailableVehicles(result.vehicles);
            } catch (error) {
                console.error("Error fetching available resources:", error);
            }
        }
    };
    // Solo ejecutar cuando cambian las fechas
    useEffect(() => {
        fetchAvailableResources();
    }, [data.start_time, data.end_time, data.driver_id, data.car_id]);

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
                onClose();
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
                        : "Asignar Vehiculo a Conductor"}
                </h2>
                {isEditing ? (
                    <div className="py-4">
                        <strong>Conductor: </strong> {schedule?.conductor}{" "}
                        <br />
                        <strong>Metricula del vehiculo: </strong>{" "}
                        {schedule?.matricula}
                    </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="start_time"
                            value="Fecha de inicio"
                        />
                        <TextInput
                            id="start_time"
                            type="datetime-local"
                            className="mt-1 block w-full"
                            value={data.start_time}
                            onChange={(e) =>
                                setData("start_time", e.target.value)
                            }
                            required
                            min={isEditing ? "" : formattedToday}
                        />
                        <InputError
                            className="mt-2"
                            message={errors.start_time}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="end_time"
                            value="Fecha Fin Activo"
                        />
                        <TextInput
                            id="end_time"
                            type="datetime-local"
                            className="mt-1 block w-full"
                            value={data.end_time}
                            onChange={(e) =>
                                setData("end_time", e.target.value)
                            }
                            required
                            isFocused
                        />
                        <InputError
                            className="mt-2"
                            message={errors.end_time}
                        />
                    </div>
                </div>
                <div>
                    <InputLabel
                        htmlFor="driver_id"
                        value="Designar Conductor"
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
                <div>
                    <InputLabel htmlFor="car_id" value="Seleccionar Vehiculo" />
                    <SelectInput
                        isFocused
                        className="mt-1 block w-full"
                        required={isEditing ? false : true}
                        value={data.car_id || ""}
                        onChange={(e) =>
                            setData("car_id", parseInt(e.target.value))
                        }
                    >
                        <option value="" disabled>
                            {availableVehicles.length > 0
                                ? "Selecciona Vehiculo"
                                : "No hay datos disponibles"}
                        </option>
                        {availableVehicles.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.matricula}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.car_id} />
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
                        {processing ? "Processing..." : "Crear Programación"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default ModalFormSchedule;
