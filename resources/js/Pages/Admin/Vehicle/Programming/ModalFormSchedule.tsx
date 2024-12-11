import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import { DriverInterface } from "@/interfaces/Driver";
import { ScheduleInterface } from "@/interfaces/schedule";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    show: boolean;
    onClose: () => void;
    drivers: DriverInterface[];
    schecule?: ScheduleInterface;
    cardId: number;
    isEditing: boolean; 
};

function ModalFormSchedule({
    isEditing,
    show,
    onClose,
    drivers,
    schecule,
    cardId,
}: Props) {
    const initialData = schecule || {
        id: null,
        car_id: cardId,
        start_time: " ",
        end_time: " ",
        driver_id: "",
    };

    const { data, setData, post, patch, errors, processing } = useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [schecule]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing && data.id) {
            patch(route("vehicle.programming.update", data.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route("vehicle.programming"), {
                onSuccess: () => onClose(),
            });
        }
    };
    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-200 mb-2">
                    {isEditing ? "Editar Información" : "Asignar Vehiculo a Conductor"}
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
                        value={data.driver_id} // Vinculación al estado
                        onChange={(e) => setData("driver_id", e.target.value)}
                        //onSelect={data.driver_id}
                    >
                        <option value="" disabled>
                            Seleccionar un conductor
                        </option>
                        {drivers.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.full_name}
                            </option>
                        ))}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.driver_id} />
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel
                            htmlFor="start_time"
                            value="Fecha de inicio"
                        />
                        <TextInput
                            id="start_time"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.start_time}
                            onChange={(e) =>
                                setData("start_time", e.target.value)
                            }
                            required
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
                            type="date"
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
