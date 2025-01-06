import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import {
    FormMantenimientoType,
    TipoMantenimientoInterface,
} from "@/interfaces/Mantenimiento";
import { VehicleInterface } from "@/interfaces/Vehicle";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

type Props = {
    show: boolean;
    onClose: () => void;
    infoData?: FormMantenimientoType;
    tipos: TipoMantenimientoInterface[];
    vehicles: VehicleInterface[];
    isEditing: boolean;
};

function FormModalMantenimieto({
    isEditing,
    show,
    onClose,
    infoData,
    tipos,
    vehicles,
}: Props) {
    const initialData = infoData || {
        id: null,
        vehicle_id: null,
        fecha_inicio: "",
        observaciones: "",
        tipo: null,
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
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-2">
                    {isEditing
                        ? "Editar Información"
                        : "Programar Mantenimiento"}
                </h2>
                <div>
                    <InputLabel htmlFor="fecha_inicio" value="fecha" />
                    <TextInput
                        id="fecha_inicio"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.fecha_inicio}
                        onChange={(e) =>
                            setData("fecha_inicio", e.target.value)
                        }
                        required
                    />
                    <InputError
                        className="mt-2"
                        message={errors.fecha_inicio}
                    />
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
                <div>
                    <InputLabel htmlFor="vehicle_id" value="Seleccionar Vehiculo" />
                    <SelectInput
                        isFocused
                        required
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData("vehicle_id", parseInt(e.target.value))
                        }
                        value={data.vehicle_id!}
                    >
                        <option value="" disabled>
                            {vehicles && vehicles.length > 0
                                ? "Seleccionar matricula"
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
                    <InputError className="mt-2" message={errors.vehicle_id} />
                </div>
                <div>
                    <InputLabel htmlFor="tipo" value="Tipo de mantenimiento" />
                    <SelectInput
                        isFocused
                        required
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData("tipo", parseInt(e.target.value))
                        }
                        value={data.tipo!}
                    >
                        <option value="" disabled>
                            {tipos && tipos.length > 0
                                ? "Seleccionar Tipo"
                                : "No hay datos disponibles"}
                        </option>
                        {tipos && tipos.length > 0
                            ? tipos.map((item, index) => (
                                  <option key={index} value={item.id}>
                                      {item.name}
                                  </option>
                              ))
                            : null}
                    </SelectInput>
                    <InputError className="mt-2" message={errors.tipo} />
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

export default FormModalMantenimieto;
