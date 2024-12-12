import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import { MarksInterface, TypeInterface } from "@/interfaces/Modelo";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

type Props = {
    marcas: MarksInterface[];
    typesVehicle: TypeInterface[];
    vehicle: VehicleInterface;
    isEditing: boolean; // Indica si se está editando un usuario o creando uno nuevo
};

const estadosVehiculos = [
    { value: "activo", name: "Activo" },
    { value: "mantenimiento", name: "Mantenimiento" },
    { value: "inactivo", name: "Inactivo" },
];

const showVehicle: React.FC<Props> = ({ marcas, typesVehicle, vehicle, isEditing }) => {
    const initialData = vehicle || {
        id: null,
        matricula: "",
        mark_id: "",
        color: "",
        modelo: "",
        type_id: "",
        fecha_compra: "",
        status: "",
        capacidad_carga: "",
    };

    const { data, setData, post, patch, errors, processing } = useForm(initialData);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing && data?.id) {
            patch(route("vehicle.update", data.id));
        } else {
            post(route("vehicle.store"))
        }
    };
    return (
        <Authenticated>
            <Head title={isEditing ? 'Editar' : 'Crear'} />
            <Breadcrumb pageName={isEditing ? 'Editar info' : 'Crear nuevo Vehiculo'} />
            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                    {isEditing ? "Edit Vehicle Information" : "Create New Vehicle"}
                    </h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <InputLabel htmlFor="matricula" value="Matricula" />
                            <TextInput
                                id="matricula"
                                className="mt-1 block w-full"
                                value={data.matricula}
                                onChange={(e) =>
                                    setData("matricula", e.target.value)
                                }
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.matricula}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="marca"
                                value="Marca de Vehiculo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("mark_id", e.target.value)
                                } // Añade esta línea para manejar el cambio
                            >
                                {marcas.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item.id}
                                        selected={item.name === data.mark_id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.mark_id}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="type"
                                value="Tipo de Vehiculo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("type_id", e.target.value)
                                }
                                //onSelect={`${data.type_id}`}
                            >
                                {typesVehicle.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.type_id}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="modelo"
                                value="Modelo de Vehiculo"
                            />
                            <TextInput
                                id="modelo"
                                className="mt-1 block w-full"
                                value={data.modelo} // Cambia esto a 'data.modelo'
                                onChange={(e) =>
                                    setData("modelo", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.modelo}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="color"
                                value="Color de Vehiculo"
                            />
                            <TextInput
                                id="color"
                                className="mt-1 block w-full"
                                value={data.color} // Cambia esto a 'data.color'
                                onChange={(e) =>
                                    setData("color", e.target.value)
                                }
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.color}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="capacidad_carga"
                                value="Capacidad de Carga"
                            />
                            <TextInput
                                id="capacidad_carga"
                                className="mt-1 block w-full"
                                value={data.capacidad_carga} // Cambia esto a 'data.capacidad_carga'
                                onChange={(e) =>
                                    setData("capacidad_carga", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.capacidad_carga}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="fecha_compra"
                                value="Fecha de Compra"
                            />
                            <TextInput
                                id="fecha_compra"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.fecha_compra} // Cambia esto a 'data.ci'
                                onChange={(e) =>
                                    setData("fecha_compra", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.fecha_compra}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Estado" />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                } // Añade esta línea para manejar el cambio
                            >
                                {estadosVehiculos.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item.value}
                                        selected={item.value === data.status}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.status}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <LinkButton href={'vehicle.list'}>
                            Cancelar
                        </LinkButton>

                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing
                            ? "Processing..."
                            : isEditing
                            ? "Save Changes"
                            : "Create Vehicle"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
};

export default showVehicle;
