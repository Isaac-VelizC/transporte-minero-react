import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Card from "@/Components/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import { DriverInterface } from "@/interfaces/Driver";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import React from "react";
import toast from "react-hot-toast";

const generos = [
    { value: "Hombre", label: "Masculino" },
    { value: "Mujer", label: "Femenino" },
    { value: "Otro", label: "Otro" },
];

type Props = {
    isEditing: boolean;
    driver?: DriverInterface;
};

export default function drivers({ isEditing, driver }: Props) {
    const initialData = driver || {
        user_id: null,
        nombre: "",
        ap_pat: "",
        ap_mat: "",
        email: "",
        ci: "",
        genero: "",
        numero: "",
        license_number: "",
        hiring_date: "",
    };

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeUrl =
            isEditing && data.user_id
                ? route("driver.update", [
                      data.user_id,
                      data.id,
                      data.driver_id,
                  ])
                : route("driver.store");

        const method = isEditing && data.user_id ? patch : post;

        method(routeUrl, {
            preserveScroll: true,
            onSuccess: ({ props: { flash } }) => {
                if (flash?.error) toast.error(flash.error);
            },
            onError: () => {
                toast.error(
                    "Ocurrió un error inesperado al procesar la solicitud."
                );
            },
            onFinish: () => {
                // Aquí puedes agregar lógica adicional si es necesario
            },
        });
    };

    return (
        <Authenticated>
            <Head title="Create" />
            <Breadcrumb pageName="Conductor" />
            <Card>
                <form className="p-6" onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEditing
                            ? "Editar information"
                            : "Registrar uevo conductor"}
                    </h2>
                    <br />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                            <InputLabel htmlFor="nombre" value="Nombre" />
                            <TextInput
                                id="nombre"
                                className="mt-1 block w-full"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData("nombre", e.target.value)
                                }
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.nombre}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="ap_pat"
                                value="Apellido Paterno"
                            />
                            <TextInput
                                id="ap_pat"
                                className="mt-1 block w-full"
                                value={data.ap_pat} // Cambia esto a 'data.ap_pat'
                                onChange={(e) =>
                                    setData("ap_pat", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.ap_pat}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="ap_mat"
                                value="Apellido Materno"
                            />
                            <TextInput
                                id="ap_mat"
                                className="mt-1 block w-full"
                                value={data.ap_mat} // Cambia esto a 'data.ap_mat'
                                onChange={(e) =>
                                    setData("ap_mat", e.target.value)
                                }
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.ap_mat}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Correo Electronico"
                            />
                            <TextInput
                                id="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="ci"
                                value="Cedula de Identidad"
                            />
                            <TextInput
                                id="ci"
                                className="mt-1 block w-full"
                                value={data.ci}
                                onChange={(e) => setData("ci", e.target.value)}
                                required
                                isFocused
                            />
                            <InputError className="mt-2" message={errors.ci} />
                        </div>
                        <div>
                            <InputLabel htmlFor="numero" value="Teléfono" />
                            <TextInput
                                id="numero"
                                className="mt-1 block w-full"
                                value={data.numero}
                                onChange={(e) =>
                                    setData("numero", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.numero}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="genero" value="Genero" />
                            <SelectInput
                                className="mt-1 block w-full"
                                required
                                onChange={(e) =>
                                    setData("genero", e.target.value)
                                }
                                value={data.genero}
                                defaultValue={""}
                            >
                                <option value="" disabled>
                                    {generos && generos.length > 0
                                        ? "Selecciona un genero"
                                        : "No hay datos disponibles"}
                                </option>
                                {generos && generos.length > 0
                                    ? generos.map((item, index) => (
                                          <option
                                              key={index}
                                              value={item.value}
                                          >
                                              {item.label}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError
                                className="mt-2"
                                message={errors.genero}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="license_number"
                                value="Numero de licencia"
                            />
                            <TextInput
                                id="license_number"
                                className="mt-1 block w-full"
                                value={data.license_number}
                                onChange={(e) =>
                                    setData("license_number", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.license_number}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="hiring_date"
                                value="Fecha de Contratacion"
                            />
                            <TextInput
                                type="date"
                                id="hiring_date"
                                className="mt-1 block w-full"
                                value={data.hiring_date}
                                onChange={(e) =>
                                    setData("hiring_date", e.target.value)
                                }
                                required
                                isFocused
                            />
                            <InputError
                                className="mt-2"
                                message={errors.hiring_date}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <LinkButton href="drivers.list">Cancelar</LinkButton>
                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : isEditing
                                ? "Save Changes"
                                : "Registar Conductor"}
                        </PrimaryButton>
                    </div>
                </form>
            </Card>
        </Authenticated>
    );
}
