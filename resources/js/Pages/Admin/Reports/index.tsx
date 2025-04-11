import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Card from "@/Components/Cards/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import { DriverInterface } from "@/interfaces/Driver";
import { PersonaInterface } from "@/interfaces/Persona";
import { ReportsInterface } from "@/interfaces/Reports";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Papa from "papaparse";
import axios from "axios";
import { useState } from "react";

// Define Props interface
interface Props {
    vehiculos: VehicleInterface[];
    clientes: PersonaInterface[];
    drivers: DriverInterface[];
    results: ReportsInterface[];
}

export default function Index({ clientes, results }: Props) {
    const [filteredResults, setFilteredResults] = useState(results);
    const { data, setData, errors, post, reset } = useForm({
        vehiculo: "",
        cliente: "",
        conductor: "",
        mes: "",
        fecha: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                route("admin.reports.filter"),
                data
            );
            setFilteredResults(response.data.results); // Actualizar los resultados filtrados
        } catch (error) {
            console.error("Error al filtrar:", error);
        }
    };

    // Función para exportar a CSV
    const exportToCSV = () => {
        const csvData = filteredResults.map((item) => ({
            Codigo: item.id,
            Cliente: item.client
                ? `${item.client.nombre} ${item.client.ap_pat ?? ""} ${
                      item.client.ap_mat ?? ""
                  }`.trim()
                : "N/A",
            "Cantidad Camiones": item.vehicle_schedules.length ?? "N/A",
            Estado: item.status,
            Fecha: item.fecha_envio,
            Destino: item.destino,
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "reportes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Authenticated>
            <Head title="Reports" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Resportes de envios" },
                ]}
            />
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <InputLabel htmlFor="cliente" value="Cliente" />
                            <SelectInput
                                id="cliente"
                                className="mt-1 block w-full"
                                value={data.cliente || ""}
                                onChange={(e) =>
                                    setData("cliente", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    {clientes && clientes.length > 0
                                        ? "Selecciona cliente"
                                        : "No hay datos disponibles"}
                                </option>
                                {clientes && clientes.length > 0
                                    ? clientes.map((item) => (
                                          <option key={item.id} value={item.id}>
                                              {`${item.nombre || ""} ${
                                                  item.ap_pat || ""
                                              } ${item.ap_mat || ""}`.trim()}
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
                {filteredResults && filteredResults.length > 0 ? (
                    <>
                        <button
                            onClick={exportToCSV}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            Exportar CSV
                        </button>
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
                                            Cantidad Camiones
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Estado
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Fecha
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Destino
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map(
                                        (
                                            item: ReportsInterface,
                                            index: number
                                        ) => (
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
                                                                    .nombre ||
                                                                "N/A"
                                                            } ${
                                                                item.client
                                                                    .ap_pat ||
                                                                ""
                                                            } ${
                                                                item.client
                                                                    .ap_mat ||
                                                                ""
                                                            }`.trim() || "N/A"}
                                                        </>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {item.vehicle_schedules
                                                        .length || "N/A"}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {item.status}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {item.fecha_envio}
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
                    </>
                ) : (
                    <p className="text-gray-600">
                        No se encontraron resultados para los filtros aplicados.
                    </p>
                )}
            </Card>
        </Authenticated>
    );
}
