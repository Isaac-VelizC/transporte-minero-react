import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Card from "@/Components/Cards/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import SelectLatLonMap from "@/Components/Maps/SelectLatLonMap";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    dataCarga: ShipmentInterface;
    driverId: number;
    carId: number;
};

export default function createAltercation({
    dataCarga,
    driverId,
    carId,
}: Props) {
    const initialData = {
        id: null,
        driver_id: driverId,
        car_id: carId,
        envio_id: dataCarga.id,
        tipo_altercado: "",
        description: "",
        last_latitude: null as number | null,
        last_longitude: null as number | null,
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    // Estado para la posición actual
    const [position, setPosition] = useState<[number, number] | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const action = data.id ? patch : post;
        const routeName = data.id
            ? "mantenimiento.update"
            : "driver.store.altercado";
        console.log(data);

        action(route(routeName, `${data.id}`), {
            onSuccess: ({ props: { flash } }) => {
                reset();
                if (flash?.error) toast.success(flash.error);
            },
            onError: () => {
                toast.error("Error al registrar el altercado.");
            },
        });
    };

    const getCurrentPosition = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentPosition: [number, number] = [
                        pos.coords.latitude,
                        pos.coords.longitude,
                    ];
                    setPosition(currentPosition);
                    setData((prevData) => ({
                        ...prevData,
                        last_latitude: pos.coords.latitude,
                        last_longitude: pos.coords.longitude,
                    }));
                },
                () => alert("No se pudo obtener la ubicación automáticamente.")
            );
        }
    }, [setData]);

    useEffect(() => {
        getCurrentPosition();
    }, []);

    // Memoización del handler de cambio de mapa
    const handleMapChange = useCallback(
        (lat: number, lon: number) => {
            setData((prevData) => ({
                ...prevData,
                last_latitude: lat,
                last_longitude: lon,
            }));
            setPosition([lat, lon]);
        },
        [setData]
    );

    return (
        <Authenticated>
            <Head title="Show" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <form className="sm:p-6" onSubmit={handleSubmit}>
                        <h2 className="text-lg font-semibold">
                            Reportar un altercado
                        </h2>
                        <div className="mt-6">
                            <InputLabel
                                htmlFor="status"
                                value="Seleccionar Tipo"
                            />
                            <SelectInput
                                isFocused
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("tipo_altercado", e.target.value)
                                }
                                value={data.tipo_altercado || ""}
                            >
                                <option value="">Seleccionar Tipo</option>
                                <option value="bloqueo">Bloqueo</option>
                                <option value="descanso">Descanso</option>
                                <option value="accidente">Accidente</option>
                                <option value="fallas">Fallas</option>
                                <option value="otro">Otro</option>
                            </SelectInput>
                            <InputError
                                message={errors.tipo_altercado}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Descripción de altercado"
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
                            <Link
                                href={route("driver.envio.show", dataCarga.id)}
                            >
                                Cancelar
                            </Link>
                            <PrimaryButton
                                type="submit"
                                className="ms-3"
                                disabled={processing}
                            >
                                {processing
                                    ? "Processing..."
                                    : "Reportar Altercado"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
                <Card>
                    {position && (
                        <>
                            <p>
                                Ubicación actual: Latitud {position[0]},
                                Longitud {position[1]}
                            </p>
                            <div style={{ height: "400px", marginTop: "20px" }}>
                                <SelectLatLonMap
                                    latitud={data.last_latitude || position[0]}
                                    longitud={
                                        data.last_longitude || position[1]
                                    }
                                    onChange={handleMapChange}
                                />
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </Authenticated>
    );
}
