import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import { DeviceInterface } from "@/interfaces/Device";
import { VehicleInterface } from "@/interfaces/Vehicle";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";

type Props = {
    show: boolean;
    onClose: () => void;
    vehicles: VehicleInterface[];
    device?: DeviceInterface;
    isEditing: boolean;
};

const FormModal: React.FC<Props> = ({
    show,
    onClose,
    vehicles,
    device,
    isEditing,
}) => {
    const initialData = device || {
        id: null,
        num_serial: "",
        name_device: "",
        type: "",
        car_id: null,
        status: "",
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [device]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const action = isEditing && data?.id ? patch : post;
        const routeName =
            isEditing && data?.id ? "devices.update" : "devices.create";
        const routeParams = isEditing && data?.id ? data?.id : undefined;

        action(route(routeName, routeParams), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-900">
                    {isEditing
                        ? "Editar informacion del dispositivo"
                        : "Registrar nuevo dispositivo"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                    <div>
                        <InputLabel
                            htmlFor="num_serial"
                            value="Numero Serial"
                        />
                        <TextInput
                            id="num_serial"
                            className="mt-1 block w-full"
                            value={data.num_serial}
                            onChange={(e) =>
                                setData("num_serial", e.target.value)
                            }
                            required
                        />
                        <InputError
                            className="mt-2"
                            message={errors.num_serial}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="name_device"
                            value="Nombre del Dispositivo"
                        />
                        <TextInput
                            id="name_device"
                            className="mt-1 block w-full"
                            value={data.name_device}
                            onChange={(e) =>
                                setData("name_device", e.target.value)
                            }
                            required
                            isFocused
                        />
                        <InputError
                            className="mt-2"
                            message={errors.name_device}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="type" value="Tipo de SO" />
                        <TextInput
                            id="type"
                            value={data.type}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("type", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.type} />
                    </div>
                    <div>
                        <InputLabel htmlFor="car_id" value="Seleccionar Vehiculo" />
                        <SelectInput
                            isFocused
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData("car_id", Number(e.target.value))
                            }
                            value={data.car_id || ""}
                            defaultValue={""}
                        >
                            <option value="" disabled>
                                {vehicles && vehicles.length > 0
                                    ? "Selecciona una matricula de vehiculo"
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
                    <div>
                        <InputLabel
                            htmlFor="status"
                            value="Estado del Dispositivo"
                        />
                        <SelectInput
                            isFocused
                            required
                            className="mt-1 block w-full"
                            onChange={(e) => setData("status", e.target.value)}
                            value={data.status}
                            defaultValue={"activo"}
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </SelectInput>
                        <InputError className="mt-2" message={errors.status} />
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
                        {processing
                            ? "Processing..."
                            : isEditing
                            ? "Guardar cambios"
                            : "Registrar"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default FormModal;
