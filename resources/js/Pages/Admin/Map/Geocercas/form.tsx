import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import GeofenceMap from "@/Components/Maps/GeofenceMap";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

type TypesGeocerca = {
    value: string;
};

type Props = {
    types: TypesGeocerca[];
    geocerca: GeocercaInterface;
    isEditing: boolean; // Indica si se está editando un usuario o creando uno nuevo
};

export default function form({ isEditing, geocerca, types }: Props) {
    const initialData = geocerca || {
        id: null,
        name: "",
        polygon_coordinates: "[51.505, -0.09]",
        type: "",
        description: "",
    };

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing && data?.id) {
            patch(route("geocerca.update", data.id));
        } else {
            post(route("geocerca.store"));
        }
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
            <Breadcrumb pageName="Create" />
            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                        {isEditing
                            ? "Edit geocerca Information"
                            : "Create New geocerca"}
                    </h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nombre de la Geocerca"
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
                                htmlFor="types"
                                value="Tipo de Geocerca"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                onSelect={data.type.toString}
                            >
                                {types.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.value}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.type}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="polygon_coordinates"
                                value="Coordenadas del poligono"
                            />
                            <TextInput
                                id="polygon_coordinates"
                                type="text"
                                className="mt-1 block w-full disabled:bg-gray-300"
                                value={data.polygon_coordinates}
                                onChange={(e) =>
                                    setData(
                                        "polygon_coordinates",
                                        e.target.value
                                    )
                                }
                                required
                                disabled
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.polygon_coordinates}
                            />
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
                                ? "Save Changes"
                                : "Create Geocerca"}
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
