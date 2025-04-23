import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Checkbox from "@/Components/Forms/Checkbox";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import GeofenceMap from "@/Components/Maps/GeofenceMap";
import { TipoGeocerca } from "@/data";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";
import toast from "react-hot-toast";

type Props = {
    geocerca: GeocercaInterface;
    isEditing: boolean;
};

export default function form({ isEditing, geocerca }: Props) {
    const initialData = geocerca || {
        id: null,
        name: "",
        polygon_coordinates: "[51.505, -0.09]",
        type: "zona_de_trabajo",
        description: "",
        color: "",
        is_active: true,
    };

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeUrl =
            isEditing && data?.id
                ? route("geocerca.update", data.id)
                : route("geocerca.store");

        const method = isEditing && data?.id ? patch : post;

        method(routeUrl, {
            onSuccess: ({ props: { flash } }) => {
                if (flash?.error) toast.error(flash.error);
                if (flash?.success) toast.success(flash.success);
            },
            onError: () => {
                const errorMessage = isEditing
                    ? "Error al actualizar la geocerca"
                    : "Error al registrar la geocerca";
                toast.error(errorMessage);
            },
        });
    };

    const handlePolygonUpdated = (coordinates: number[][]) => {
        setData((prevData) => ({
            ...prevData,
            polygon_coordinates: JSON.stringify(coordinates),
        }));
    };

    return (
        <Authenticated>
            <Head title="Geocerca" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/geocerca" },
                    { name: isEditing ? "Editar" : "Registrar nuevo" },
                ]}
            />
            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                        {isEditing
                            ? "Editar geocerca Información"
                            : "Crear nueva geocerca"}
                    </h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nombre de la Geocerca"
                                required
                            />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.name}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="type"
                                value="Tipo"
                                required
                            />
                            <SelectInput
                                id="type"
                                type="text"
                                className="mt-1 block w-full disabled:bg-gray-300"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                required
                            >
                                {TipoGeocerca.length <= 0 ? (
                                    <option value={""}>No har datos</option>
                                ) : (
                                    TipoGeocerca.map((item, index) => (
                                        <option key={index} value={item.nombre}>
                                            {item.nombre}
                                        </option>
                                    ))
                                )}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.type}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="color"
                                    value="Color de la Geocerca"
                                    required
                                />
                                <TextInput
                                    id="color"
                                    className="mt-1 block w-full"
                                    value={data.color || "#36f239"}
                                    type="color"
                                    onChange={(e) =>
                                        setData("color", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.color}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="is_active"
                                    value="Estado de la Geocerca"
                                    required
                                />
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.is_active}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Descripcion Corta"
                        />
                        <textarea
                            id="description"
                            rows={4}
                            className="mt-1 block w-full rounded-md"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            value={data.description}
                        />
                        <InputError
                            className="mt-2"
                            message={errors.description}
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <LinkButton href={"geocerca.list"}>Cancelar</LinkButton>
                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : isEditing
                                ? "Guardar cambios"
                                : "Crear Geocerca"}
                        </PrimaryButton>
                    </div>
                </form>
                <div className="mt-4">
                    <GeofenceMap
                        initialCoordinates={
                            isEditing
                                ? JSON.parse(data.polygon_coordinates) || []
                                : []
                        }
                        onPolygonUpdated={handlePolygonUpdated}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
