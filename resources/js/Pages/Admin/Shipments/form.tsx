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
import { TipoMineralInterface } from "@/interfaces/TipoMineral";
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
    tipoMineral: TipoMineralInterface[];
};

export default function form({
    isEditing,
    shipment,
    schedules,
    clientes,
    geocercas,
    selects,
    tipoMineral,
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
                      mineral_id: null,
                      peso: "",
                      origen: "",
                      destino: "",
                      fecha_entrega: "",
                      fecha_envio: "",
                      notas: "",
                      sub_total: 0,
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
    const hoy = new Date();
    const fechaActual = hoy.toISOString().slice(0, -8);
    const total = useMemo(() => {
        return (data.sub_total || 0) * (parseInt(data.peso) || 0);
    }, [data.sub_total, data.peso]);

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

    const handleMineralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMineralId = parseFloat(e.target.value);
        data.mineral_id = selectedMineralId;
        // Buscar el precio del mineral seleccionado
        const selectedMineral = tipoMineral.find(
            (item) => item.id === selectedMineralId
        );

        if (selectedMineral) {
            setData("sub_total", selectedMineral.precio); // Asignar el precio al sub_total
        } else {
            setData("sub_total", 0); // Si no se encuentra, establecer a 0
        }
    };

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
                                    required
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
                                                  {item.nombre +
                                                      " " +
                                                      (item.ap_pat ?? "") +
                                                      " " +
                                                      (item.ap_mat ?? "")}
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
                                    required
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
                                    required
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
                                    required
                                />
                                <TextInput
                                    id="fecha_envio"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.fecha_envio || ""}
                                    onChange={(e) =>
                                        setData("fecha_envio", e.target.value)
                                    }
                                    min={fechaActual}
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
                                    required
                                />
                                <TextInput
                                    id="fecha_entrega"
                                    type="datetime-local"
                                    className="mt-1 block w-full"
                                    value={data.fecha_entrega || ""}
                                    onChange={(e) =>
                                        setData("fecha_entrega", e.target.value)
                                    }
                                    min={fechaActual}
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
                                    htmlFor="mineral_id"
                                    value="Seleccionar tipo mineral"
                                    required
                                />
                                <SelectInput
                                    isFocused
                                    className="mt-1 block w-full"
                                    required
                                    onChange={handleMineralChange}
                                    value={data.mineral_id || 0}
                                >
                                    <option value={0} disabled>
                                        {tipoMineral && tipoMineral.length > 0
                                            ? "Selecciona un mineral"
                                            : "No hay datos disponibles"}
                                    </option>
                                    {tipoMineral && tipoMineral.length > 0
                                        ? tipoMineral.map((item) => (
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
                                    message={errors.mineral_id}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="sub_total"
                                    value="Costo por Tonelada"
                                    required
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
                                    required
                                />
                                <TextInput
                                    id="peso"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.peso || ""}
                                    onChange={(e) =>
                                        setData("peso", e.target.value)
                                    }
                                    min={10}
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.peso}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="total"
                                    value="Monto Total"
                                />
                                <TextInput
                                    id="total"
                                    type="number"
                                    className="mt-1 block w-full bg-gray-400 text-white"
                                    value={total || ""}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div>
                                <InputLabel
                                    htmlFor="programming"
                                    value="Vehiculo mas capacidad de Carga"
                                    required
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
                        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                            <div>
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
                            <div>
                                <LinkButton href={"envios.list"}>
                                    Cancelar
                                </LinkButton>

                                <PrimaryButton
                                    type="submit"
                                    className="ms-3"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Procesando..."
                                        : isEditing
                                        ? "Guardar Cambios"
                                        : "Registrar Envio"}
                                </PrimaryButton>
                            </div>
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
                </form>
            </div>
        </Authenticated>
    );
}
