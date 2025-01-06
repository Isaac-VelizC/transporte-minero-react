import React, { useEffect } from "react";
import Modal from "../../../Components/Modal/Modal";
import SecondaryButton from "../../../Components/Buttons/SecondaryButton";
import InputLabel from "../../../Components/Forms/InputLabel";
import TextInput from "../../../Components/Forms/TextInput";
import InputError from "../../../Components/Forms/InputError";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "../../../Components/Buttons/PrimaryButton";
import SelectInput from "../../../Components/Forms/SelectInput";
import { RolesInterface } from "@/interfaces/Roles";
import toast from "react-hot-toast";

const generos = [
    { value: "Hombre", label: "Masculino" },
    { value: "Mujer", label: "Femenino" },
    { value: "Otro", label: "Otro" },
];

type Props = {
    show: boolean;
    onClose: () => void;
    users?: formUserType;
    roles?: RolesInterface[];
    isEditing: boolean;
    rutaName: string;
};

const ModalFormUser: React.FC<Props> = ({
    show,
    onClose,
    users,
    roles,
    isEditing,
    rutaName,
}) => {
    const initialData = users || {
        id: null,
        user_id: null,
        nombre: "",
        ap_pat: "",
        ap_mat: "",
        email: "",
        ci: "",
        genero: "",
        numero: "",
        rol: "",
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [users]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeName =
            isEditing && data?.user_id
                ? `${rutaName}.update`
                : `${rutaName}.create`;
        const method = isEditing && data?.user_id ? patch : post;

        method(route(routeName, [data.user_id, data.id]), {
            onSuccess: (page) => {
                toast.error(`${page.props.flash.error}`);
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-900">
                    {isEditing ? "Edit User Information" : "Create New User"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            className="mt-1 block w-full"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.nombre} />
                    </div>
                    <div>
                        <InputLabel htmlFor="ap_pat" value="Apellido Paterno" />
                        <TextInput
                            id="ap_pat"
                            className="mt-1 block w-full"
                            value={data.ap_pat}
                            onChange={(e) => setData("ap_pat", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.ap_pat} />
                    </div>
                    <div>
                        <InputLabel htmlFor="ap_mat" value="Apellido Materno" />
                        <TextInput
                            id="ap_mat"
                            value={data.ap_mat || ""}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("ap_mat", e.target.value)}
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.ap_mat} />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Correo Electronico"
                        />
                        <TextInput
                            id="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                    <div>
                        <InputLabel htmlFor="ci" value="Cedula de Identidad" />
                        <TextInput
                            id="ci"
                            value={data.ci}
                            className="mt-1 block w-full"
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
                            value={data.numero || ""}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("numero", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.numero} />
                    </div>
                    <div>
                        <InputLabel htmlFor="genero" value="Genero" />
                        <SelectInput
                            isFocused
                            required
                            className="mt-1 block w-full"
                            onChange={(e) => setData("genero", e.target.value)}
                            value={data.genero}
                        >
                            <option value="" disabled>
                                {generos && generos.length > 0
                                    ? "Selecciona un genero"
                                    : "No hay datos disponibles"}
                            </option>
                            {generos && generos.length > 0
                                ? generos.map((item, index) => (
                                      <option key={index} value={item.value}>
                                          {item.label}
                                      </option>
                                  ))
                                : null}
                        </SelectInput>
                        <InputError className="mt-2" message={errors.genero} />
                    </div>
                    {roles && roles.length > 0 ? (
                        <div>
                            <InputLabel htmlFor="rol" value="Rol" />
                            <SelectInput
                                isFocused
                                required
                                className="mt-1 block w-full"
                                onChange={(e) => setData("rol", e.target.value)}
                                value={data.rol}
                            >
                                <option value="" disabled>
                                    {roles && roles.length > 0
                                        ? "Selecciona un rol"
                                        : "No hay datos disponibles"}
                                </option>
                                {roles && roles.length > 0
                                    ? roles.map((item, index) => (
                                          <option key={index} value={item.name}>
                                              {item.name}
                                          </option>
                                      ))
                                    : null}
                            </SelectInput>
                            <InputError className="mt-2" message={errors.rol} />
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton
                        type="submit"
                        className="ms-3"
                        disabled={processing}
                    >
                        {processing
                            ? "Processing..."
                            : isEditing
                            ? "Save Changes"
                            : "Create User"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
export default ModalFormUser;
