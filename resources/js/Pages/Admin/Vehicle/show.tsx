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
};

const estadosVehiculos = [
    { value: "activo", name: "Activo" },
    { value: "mantenimiento", name: "Mantenimiento" },
    { value: "inactivo", name: "Inactivo" },
];

const showVehicle: React.FC<Props> = ({ vehicle, marcas, typesVehicle }) => {
    const { data, setData, patch, errors, processing } = useForm(vehicle);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.id) {
            patch(route("vehicle.update", data.id));
        } else {
            console.log("error no hay id del vehiculo");
        }
    };
    return (
        <Authenticated>
            <Head title="Show" />
            <Breadcrumb pageName="Show Vehicle" />

            <div className="bg-gray-600 rounded-xl mb-10 p-8 shadow-lg">
                <div className="flex justify-between text-white">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">
                            Información General
                        </h3>
                        <p className="text-sm">
                            Matricula:{" "}
                            <span className="font-medium">
                                {data.matricula}
                            </span>
                        </p>
                        <p className="text-sm">
                            Color:{" "}
                            <span className="font-medium">{data.color}</span>
                        </p>
                        <p className="text-sm">
                            Marca ID:{" "}
                            <span className="font-medium">{data.mark_id}</span>
                        </p>
                        <p className="text-sm">
                            Modelo:{" "}
                            <span className="font-medium">{data.modelo}</span>
                        </p>
                        <p className="text-sm">
                            Tipo ID:{" "}
                            <span className="font-medium">{data.type_id}</span>
                        </p>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Especificaciones</h3>
                        <p className="text-sm">
                            Capacidad de Carga:{" "}
                            <span className="font-medium">
                                {data.capacidad_carga}
                            </span>
                        </p>
                        <p className="text-sm">
                            Estado:{" "}
                            <span className="font-medium">{data.status}</span>
                        </p>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg">
                            Fechas Importantes
                        </h3>
                        <p className="text-sm">
                            Fecha de Compra:{" "}
                            <span className="font-medium">
                                {data.fecha_compra}
                            </span>
                        </p>
                        <p className="text-sm">
                            Última Revisión:{" "}
                            <span className="font-medium">
                                {data.fecha_ultima_revision}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                        Actualizar datos del vehiculo
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
                                htmlFor="mark_id"
                                value="Marca de Vehiculo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                value={data.mark_id}
                                onChange={(e) =>
                                    setData("mark_id", e.target.value)
                                }
                            >
                                {marcas?.map((item, index) => (
                                    <option key={index} value={item.id}>
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
                                htmlFor="type_id"
                                value="Tipo de Vehiculo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                value={data.type_id} // Usa value aquí
                                onChange={(e) =>
                                    setData("type_id", e.target.value)
                                }
                            >
                                {typesVehicle.map((item, index) => (
                                    <option key={index} value={item.name}>
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
                                value={data.fecha_compra}
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
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                } // Añade esta línea para manejar el cambio
                            >
                                {estadosVehiculos.map((item, index) => (
                                    <option key={index} value={item.value}>
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
                        <LinkButton href={"vehicle.list"}>
                            Cancelar
                        </LinkButton>

                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : "Actualizando Vehicle"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
};

export default showVehicle;
