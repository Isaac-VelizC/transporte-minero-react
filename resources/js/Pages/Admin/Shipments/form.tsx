import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import SelectMultiple from "@/Components/Forms/SelectMultiple";
import TextInput from "@/Components/Forms/TextInput";
import SelectOrigenDestinoMap from "@/Components/Maps/SelectOrigenDestino";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { PersonaInterface } from "@/interfaces/Persona";
import { ScheduleInterface } from "@/interfaces/schedule";
import { FormShipmentType, ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    geocercas: GeocercaInterface[];
    clientes: PersonaInterface[];
    schedules: ScheduleInterface[];
    shipment: FormShipmentType;
    isEditing: boolean;
    selects?: number[];
};

export default function form({
    isEditing,
    shipment,
    schedules,
    clientes,
    geocercas,
    selects,
}: Props) {
    const initialData = useMemo(
        () =>
            shipment
                ? {
                      ...shipment,
                      programming: selects,
                  }
                : {
                      id: null,
                      programming: [],
                      client_id: null,
                      peso: "",
                      origen: "",
                      destino: "",
                      fecha_entrega: "",
                      fecha_envio: "",
                      notas: "",
                      sub_total: 50,
                      total: null,
                      client_latitude: null,
                      client_longitude: null,
                      origen_latitude: null,
                      origen_longitude: null,
                  },
        [shipment]
    );

    // Uso de useCallback para memoizar funciones
    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    const [selectionType, setSelectionType] = useState<"origen" | "destino">(
        "destino"
    );

    const handleMapChange = useCallback(
        (lat: number, lon: number, type: "origen" | "destino") => {
            setData((prevData: any) => ({
                ...prevData,
                ...(type === "origen"
                    ? { origen_latitude: lat, origen_longitude: lon }
                    : { client_latitude: lat, client_longitude: lon }),
            }));
        },
        [setData]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (
                !data.client_latitude ||
                !data.client_longitude ||
                !data.origen_latitude ||
                !data.origen_longitude
            ) {
                toast.error("Debe seleccionar una ubicación");
                return;
            }

            const submitRoute =
                isEditing && data?.id
                    ? route("envios.update.form", data.id)
                    : route("envios.store.form");
                    
            const submitMethod = isEditing && data?.id ? patch : post;

            submitMethod(submitRoute, {
                onSuccess: ({ props: { flash } }) => {
                    if (flash?.error) {
                        toast.error(flash.error);
                    }
                    if (flash?.success) {
                        toast.success(flash.success);
                    }
                },
                onError: (errors) => {
                    toast.error("Ocurrió un error al procesar la solicitud.");
                    console.error(errors);
                },
            });
        },
        [isEditing, data, post, patch]
    );

    const options = schedules.map((item) => ({
        id: item.id,
        label: `${item.vehicle.matricula} <= ${item.vehicle.capacidad_carga}T.`,
    }));

    return (
        <Authenticated>
            <Head title="Form" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/envios" },
                    {
                        name: isEditing
                            ? "Editar Información"
                            : "Registrar nuevo",
                    },
                ]}
            />
            <div className="bg-gray-600 rounded-xl">
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-200 mb-2">
                        {isEditing
                            ? "Editar Información del envio"
                            : "Registrar nuevo envio"}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="client_id"
                                    value="Seleccionar Cliente"
                                />
                                <SelectInput
                                    isFocused
                                    className="mt-1 block w-full"
                                    required
                                    onChange={(e) =>
                                        setData(
                                            "client_id",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    value={data.client_id || 0}
                                >
                                    <option value={0} disabled>
                                        {clientes && clientes.length > 0
                                            ? "Selecciona un cliente"
                                            : "No hay datos disponibles"}
                                    </option>
                                    {clientes && clientes.length > 0
                                        ? clientes.map((item) => (
                                              <option
                                                  key={item.id}
                                                  value={item.id}
                                              >
                                                  {item.nombre}
                                              </option>
                                          ))
                                        : null}
                                </SelectInput>
                                <InputError
                                    className="mt-2"
                                    message={errors.client_id}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="origen"
                                    value="Origen de entrega"
                                />
                                <TextInput
                                    id="origen"
                                    className="mt-1 block w-full"
                                    value={data.origen || ""}
                                    onChange={(e) =>
                                        setData("origen", e.target.value)
                                    }
                                    required
                                    isFocused
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.origen}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="destino"
                                    value="Destino de entrega"
                                />
                                <TextInput
                                    id="destino"
                                    className="mt-1 block w-full"
                                    value={data.destino || ""}
                                    onChange={(e) =>
                                        setData("destino", e.target.value)
                                    }
                                    required
                                    isFocused
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.destino}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="fecha_envio"
                                    value="Fecha de Envio"
                                />
                                <TextInput
                                    id="fecha_envio"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.fecha_envio || ""}
                                    onChange={(e) =>
                                        setData("fecha_envio", e.target.value)
                                    }
                                    required
                                    isFocused
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.fecha_envio}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="fecha_entrega"
                                    value="Fecha de Entrega"
                                />
                                <TextInput
                                    id="fecha_entrega"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.fecha_entrega || ""}
                                    onChange={(e) =>
                                        setData("fecha_entrega", e.target.value)
                                    }
                                    required
                                    isFocused
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.fecha_entrega}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="sub_total"
                                    value="Costo por Tonelada"
                                />
                                <TextInput
                                    id="sub_total"
                                    type="number"
                                    className={`mt-1 block w-full ${
                                        !isEditing
                                            ? "bg-gray-400 text-white"
                                            : ""
                                    }`}
                                    value={data.sub_total || ""}
                                    disabled={isEditing ? false : true}
                                    onChange={(e) =>
                                        setData(
                                            "sub_total",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    required
                                    isFocused
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.sub_total}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="peso"
                                    value="Peso de carga"
                                />
                                <TextInput
                                    id="peso"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.peso || ""}
                                    onChange={(e) =>
                                        setData("peso", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.peso}
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div>
                                <InputLabel
                                    htmlFor="programming"
                                    value="Vehiculo mas capacidad de Carga"
                                />
                                <SelectMultiple
                                    options={options}
                                    value={data.programming ?? []}
                                    onChange={(selectedValues: number[]) =>
                                        setData(
                                            "programming",
                                            selectedValues ?? []
                                        )
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.programming}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <InputLabel htmlFor="notas" value="Notas" />
                        <textarea
                            id="notas"
                            rows={4}
                            className="mt-1 block w-full rounded-md"
                            onChange={(e) => setData("notas", e.target.value)}
                            value={data.notas}
                        />
                        <InputError className="mt-2" message={errors.notas} />
                    </div>
                    <div className="my-4">
                        <h1 className="text-lg font-semibold text-gray-300">
                            Seleccionar ubicación
                        </h1>
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                className={`px-2 py-1 rounded-lg text-sm text-white ${
                                    selectionType === "origen"
                                        ? "bg-green-700"
                                        : "bg-gray-700"
                                }`}
                                onClick={() => setSelectionType("origen")}
                            >
                                Seleccionar Origen
                            </button>
                            <button
                                type="button"
                                className={`px-2 py-1 rounded-lg text-sm text-white ${
                                    selectionType === "destino"
                                        ? "bg-blue-700"
                                        : "bg-gray-700"
                                }`}
                                onClick={() => setSelectionType("destino")}
                            >
                                Seleccionar Destino
                            </button>
                        </div>
                        <SelectOrigenDestinoMap
                            latitud={data.client_latitude}
                            longitud={data.client_longitude}
                            origenLatitud={data.origen_latitude}
                            origenLongitud={data.origen_longitude}
                            onChange={handleMapChange}
                            geocercas={geocercas}
                            selectionType={selectionType}
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <LinkButton href={"envios.list"}>Cancelar</LinkButton>

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
}
