import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Card from "@/Components/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import { DriverInterface } from "@/interfaces/Driver";
import { ReportsInterface } from "@/interfaces/Reports";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { UserInterface } from "@/interfaces/User";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

// Define Props interface
interface Props {
    vehiculos: VehicleInterface[];
    clientes: UserInterface[];
    drivers: DriverInterface[];
    results: ReportsInterface[];
}

export default function Index({
    vehiculos,
    clientes,
    drivers,
    results,
}: Props) {
    const { data, setData, errors, post, reset } = useForm({
        vehiculo: "",
        cliente: "",
        conductor: "",
        mes: "",
        fecha: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.resports.filter"));
    };

    return (
        <Authenticated>
            <Head title="Reports" />
            <Breadcrumb breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Resportes de envios" },
                ]} />
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <InputLabel htmlFor="vehiculo" value="Vehículo" />
                            <SelectInput
                                isFocused
                                required
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("vehiculo", e.target.value)
                                }
                                value={data.vehiculo}
                                defaultValue={""}
                            >
                                <option value="" disabled>
                                    {vehiculos && vehiculos.length > 0
                                        ? "Selecciona un genero"
                                        : "No hay datos disponibles"}
                                </option>
                                {vehiculos && vehiculos.length > 0
                                    ? vehiculos.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.matricula}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                message={errors.vehiculo}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente" />
                            <SelectInput
                                id="cliente"
                                className="mt-1 block w-full"
                                value={data.cliente}
                                onChange={(e) =>
                                    setData("cliente", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    {clientes && clientes.length > 0
                                        ? "Selecciona un genero"
                                        : "No hay datos disponibles"}
                                </option>
                                {clientes && clientes.length > 0
                                    ? clientes.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.full_name}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                message={errors.cliente}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="conductor" value="Conductor" />
                            <SelectInput
                                id="conductor"
                                className="mt-1 block w-full"
                                value={data.conductor}
                                onChange={(e) =>
                                    setData("conductor", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    {drivers && drivers.length > 0
                                        ? "Selecciona un genero"
                                        : "No hay datos disponibles"}
                                </option>
                                {drivers && drivers.length > 0
                                    ? drivers.map((item, index) => (
                                          <option key={index} value={item.id}>
                                              {item.full_name}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                message={errors.conductor}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="mes" value="Mes" />
                            <SelectInput
                                id="mes"
                                className="mt-1 block w-full"
                                value={data.mes}
                                onChange={(e) => setData("mes", e.target.value)}
                            >
                                <option value="">Selecciona un mes</option>
                                {[
                                    "Enero",
                                    "Febrero",
                                    "Marzo",
                                    "Abril",
                                    "Mayo",
                                    "Junio",
                                    "Julio",
                                    "Agosto",
                                    "Septiembre",
                                    "Octubre",
                                    "Noviembre",
                                    "Diciembre",
                                ].map((mes, index) => (
                                    <option key={index} value={index + 1}>
                                        {mes}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.mes} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="fecha" value="Fecha" />
                            <TextInput
                                type="date"
                                id="fecha"
                                className="mt-1 block w-full"
                                value={data.fecha}
                                onChange={(e) =>
                                    setData("fecha", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.fecha}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => reset()}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit">
                            Consultar Reportes
                        </PrimaryButton>
                    </div>
                </form>
            </Card>
            <hr className="my-6" />
            <Card>
                <h1 className="text-lg font-semibold mb-4">Resultados</h1>
                {results && results.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">
                                          Codigo
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Cliente
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Matricula del Vehículo
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Conductor
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Estado
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Carga
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        Destino
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(
                                    (item: ReportsInterface, index: number) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.id}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.client ? (
                                                    <>
                                                        {`${
                                                            item.client
                                                                .nombre || "N/A"
                                                        } ${
                                                            item.client
                                                                .ap_pat || ""
                                                        } ${
                                                            item.client
                                                                .ap_mat || ""
                                                        }`.trim() || "N/A"}
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.vehicle?.matricula ||
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                            {item.conductor ? (
                                                    <>
                                                        {`${
                                                            item.conductor
                                                                .nombre || "N/A"
                                                        } ${
                                                            item.conductor
                                                                .ap_pat || ""
                                                        } ${
                                                            item.conductor
                                                                .ap_mat || ""
                                                        }`.trim() || "N/A"}
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.status}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.peso}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.destino}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">
                        No se encontraron resultados para los filtros aplicados.
                    </p>
                )}
            </Card>
        </Authenticated>
    );
}
