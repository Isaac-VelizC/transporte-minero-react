import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import { SelectorDeColor } from "@/Components/SelectorColor";
import { coloresDisponibles } from "@/data";
import { DeviceInterface } from "@/interfaces/Device";
import { MarksInterface, TypeInterface } from "@/interfaces/Modelo";
import { FormVehicleType } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    marcas: MarksInterface[];
    typesVehicle: TypeInterface[];
    vehicle: FormVehicleType;
    devices: DeviceInterface[];
    isEditing: boolean;
};

const estadosVehiculos = [
    { value: "activo", name: "Activo" },
    { value: "mantenimiento", name: "Mantenimiento" },
    { value: "inactivo", name: "Inactivo" },
];

const showVehicle: React.FC<Props> = ({
    marcas,
    typesVehicle,
    vehicle,
    devices,
    isEditing,
}) => {
    const [colorSeleccionado, setColorSeleccionado] = useState<string>("");
    const initialData = vehicle || {
        id: null,
        matricula: "",
        mark_id: null,
        color: "",
        modelo: "",
        type_id: null,
        device_id: null,
        fecha_compra: "",
        status: "",
        capacidad_carga: null,
        kilometrage: "",
    };

    useEffect(() => {
        if (isEditing) {
            setData("color", vehicle.color);
            setColorSeleccionado(vehicle.color);
        }
    }, [])

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeUrl =
            isEditing && data?.id
                ? route("vehicle.update", data.id)
                : route("vehicle.store");
        const method = isEditing && data?.id ? patch : post;

        method(routeUrl, {
            onSuccess: ({ props: { flash } }) => {
                if (flash?.error) toast.error(flash.error);
            },
        });
    };

    const handleColorSeleccionado = (color: string) => {
        setData("color", color);
        setColorSeleccionado(color);
    };

    return (
        <Authenticated>
            <Head title={isEditing ? "Editar" : "Crear"} />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/vehicle" },
                    { name: isEditing ? "Editar información" : "Registrar Vehiculo" },
                ]}
            />
            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                        {isEditing
                            ? "Editar información del vehiculo"
                            : "Registrar nuevo vehiculo"}
                    </h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <InputLabel htmlFor="matricula" value="Matricula" />
                            <TextInput
                                id="matricula"
                                className="mt-1 block w-full uppercase"
                                value={data.matricula}
                                onChange={(e) =>
                                    setData(
                                        "matricula",
                                        e.target.value.toUpperCase()
                                    )
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
                                    setData("mark_id", parseInt(e.target.value))
                                }
                                value={data.mark_id || ""}
                            >
                                <option value="" disabled>
                                    {marcas && marcas.length > 0
                                        ? "Selecciona una Marca"
                                        : "No hay datos disponibles"}
                                </option>
                                {marcas && marcas.length > 0
                                    ? marcas.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.name}
                                          </option>
                                      ))
                                    : null}
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
                                    setData("type_id", parseInt(e.target.value))
                                }
                                value={data.type_id || ""}
                            >
                                <option value="" disabled>
                                    {typesVehicle && typesVehicle.length > 0
                                        ? "Selecciona un Tipo de camion"
                                        : "No hay datos disponibles"}
                                </option>
                                {typesVehicle && typesVehicle.length > 0
                                    ? typesVehicle.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.name}
                                          </option>
                                      ))
                                    : null}
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
                                value={data.modelo}
                                onChange={(e) =>
                                    setData("modelo", e.target.value)
                                }
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
                            <SelectorDeColor
                                colores={coloresDisponibles}
                                onColorSeleccionado={handleColorSeleccionado}
                                colorSeleccionado={data.color}
                            />
                            <p className="text-orange-500 text-sm">
                                Color seleccionado: {colorSeleccionado}
                            </p>
                            <InputError
                                className="mt-2"
                                message={errors.color}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="capacidad_carga"
                                value="Capacidad de Carga (Toneladas)"
                            />
                            <TextInput
                                id="capacidad_carga"
                                className="mt-1 block w-full"
                                type="number"
                                min={10}
                                max={50}
                                value={data.capacidad_carga}
                                onChange={(e) =>
                                    setData(
                                        "capacidad_carga",
                                        parseInt(e.target.value)
                                    )
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
                                htmlFor="device_id"
                                value="Dispositivo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData(
                                        "device_id",
                                        parseInt(e.target.value)
                                    )
                                }
                                value={data.device_id || ""}
                            >
                                <option value="" disabled>
                                    {devices && devices.length > 0
                                        ? "Selecciona un dispositivo"
                                        : "No hay datos disponibles"}
                                </option>
                                {devices && devices.length > 0
                                    ? devices.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.num_serial}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.device_id}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="fecha_compra"
                                value="Fecha de registro"
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
                            <InputLabel
                                htmlFor="kilometrage"
                                value="Kilometrage"
                            />
                            <TextInput
                                id="kilometrage"
                                type="number"
                                min={100}
                                className="mt-1 block w-full"
                                value={data.kilometrage}
                                onChange={(e) =>
                                    setData(
                                        "kilometrage",
                                        parseInt(e.target.value)
                                    )
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.kilometrage}
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
                                }
                                value={data.status || ""}
                            >
                                <option value="" disabled>
                                    {estadosVehiculos &&
                                    estadosVehiculos.length > 0
                                        ? "Selecciona Estado"
                                        : "No hay datos disponibles"}
                                </option>
                                {estadosVehiculos && estadosVehiculos.length > 0
                                    ? estadosVehiculos.map((item, index) => (
                                          <option
                                              key={index}
                                              value={item.value}
                                          >
                                              {item.name}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.status}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <LinkButton href={"vehicle.list"}>Cancelar</LinkButton>

                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing
                                ? "Procesando..."
                                : isEditing
                                ? "Guardando"
                                : "Guardar Vehiculo"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
};

export default showVehicle;
