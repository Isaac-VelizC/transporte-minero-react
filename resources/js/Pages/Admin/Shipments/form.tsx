import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import SelectOrigenDestinoMap from "@/Components/Maps/SelectOrigenDestino";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { PersonaInterface } from "@/interfaces/Persona";
import { ScheduleInterface } from "@/interfaces/schedule";
import { FormShipmentType } from "@/interfaces/Shipment";
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
};

export default function form({
    isEditing,
    shipment,
    schedules,
    clientes,
    geocercas,
}: Props) {
    const initialData = useMemo(
        () =>
            shipment || {
                id: null,
                programming: null,
                client_id: null,
                geofence_id: null,
                peso: "",
                origen: "",
                destino: "",
                fecha_entrega: "",
                fecha_envio: "",
                notas: "",
                sub_total: null,
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
            setData((prevData) => ({
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
             console.log(data);
             

            const submitMethod = isEditing && data?.id ? patch : post;

            submitMethod(submitRoute, {
                onSuccess: ({ props: { flash } }) => {
                    if (flash?.error) {
                        toast.error(flash.error);
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
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                          <option key={item.id} value={item.id}>
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
                                htmlFor="programming"
                                value="Vehiculo mas capacidad de Carga"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                value={data.programming || 0}
                                onChange={(e) =>
                                    setData(
                                        "programming",
                                        parseFloat(e.target.value)
                                    )
                                }
                            >
                                <option value={0} disabled>
                                    {schedules && schedules.length > 0
                                        ? "Selecciona un programa"
                                        : "No hay datos disponibles"}
                                </option>
                                {schedules && schedules.length > 0
                                    ? schedules.map((item) => (
                                          <option key={item.id} value={item.id}>
                                              {item.vehicle.matricula +
                                                  " <= " +
                                                  item.vehicle.capacidad_carga +
                                                  "T."}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.programming}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="geofence_id"
                                value="Seleccionar Geocerca"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData(
                                        "geofence_id",
                                        parseFloat(e.target.value)
                                    )
                                }
                                value={data.geofence_id || ""}
                            >
                                <option value="" disabled>
                                    {geocercas && geocercas.length > 0
                                        ? "Selecciona una Geocerca"
                                        : "No hay datos disponibles"}
                                </option>
                                {geocercas && geocercas.length > 0
                                    ? geocercas.map((item) => (
                                          <option key={item.id} value={item.id}>
                                              {item.name}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.geofence_id}
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
                                className="mt-1 block w-full"
                                value={data.sub_total || ""}
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
                            <InputLabel htmlFor="peso" value="Peso de carga" />
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
                                className={`px-2 py-1 rounded-lg text-sm ${
                                    selectionType === "origen"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500"
                                }`}
                                onClick={() => setSelectionType("origen")}
                            >
                                Seleccionar Origen
                            </button>
                            <button
                                className={`px-2 py-1 rounded-lg text-sm ${
                                    selectionType === "destino"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-500"
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
