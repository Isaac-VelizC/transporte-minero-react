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
import { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
    show: boolean;
    onClose: () => void;
    drivers: DriverInterface[];
    schecule?: FormScheduleType;
    vehicles: VehicleInterface[];
    isEditing: boolean;
};

function ModalFormSchedule({
    isEditing,
    show,
    onClose,
    drivers,
    schecule,
    vehicles,
}: Props) {
    
    const today = new Date().toISOString().split('T')[0];
    const initialData = schecule || {
        id: null,
        car_id: null,
        start_time: "",
        end_time: "",
        driver_id: null,
    };

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [schecule]);

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

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-200 mb-2">
                    {isEditing
                        ? "Editar Información"
                        : "Asignar Vehiculo a Conductor"}
                </h2>
                <div>
                    <InputLabel
                        htmlFor="driver_id"
                        value="Designar Conductor"
                    />
                    <SelectInput
                        isFocused
                        className="mt-1 block w-full"
                        required
                        value={data.driver_id || ''}
                        onChange={(e) =>
                            setData("driver_id", parseInt(e.target.value))
                        }
                    >
                        <option value="" disabled>
                            {drivers && drivers.length > 0
                                ? "Selecciona Conductor"
                                : "No hay datos disponibles"}
                        </option>
                        {drivers && drivers.length > 0
                            ? drivers.map((item, index) => (
                                  <option key={index} value={item.id}>
                                      {item.persona.ci}
                                  </option>
                              ))
                            : null}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.driver_id} />
                </div>
                <div>
                    <InputLabel htmlFor="car_id" value="Seleccionar Vehiculo" />
                    <SelectInput
                        isFocused
                        className="mt-1 block w-full"
                        required
                        value={data.car_id || ''}
                        onChange={(e) =>
                            setData("car_id", parseInt(e.target.value))
                        }
                    >
                        <option value="" disabled>
                            {vehicles && vehicles.length > 0
                                ? "Selecciona Vehiculo"
                                : "No hay datos disponibles"}
                        </option>
                        {vehicles && vehicles.length > 0
                            ? vehicles.map((item, index) => (
                                  <option key={index} value={item.id}>
                                      {item.matricula}
                                  </option>
                              ))
                            : null}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.car_id} />
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            min={today}
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

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton
                        type="submit"
                        className="ms-3"
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Create Vehicle"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default ModalFormSchedule;
