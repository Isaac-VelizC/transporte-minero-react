import React, { useEffect } from "react";
import Modal from "./Modal";
import SecondaryButton from "../Buttons/SecondaryButton";
import { UserInterface } from "@/interfaces/User";
import InputLabel from "../Forms/InputLabel";
import TextInput from "../Forms/TextInput";
import InputError from "../Forms/InputError";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "../Buttons/PrimaryButton";
import SelectInput from "../Forms/SelectInput";
import { RolesInterface } from "@/interfaces/Roles";

const generos = [
    { value: "Hombre", label: "Masculino" },
    { value: "Mujer", label: "Femenino" },
    { value: "Otro", label: "Otro" },
];

type Props = {
    show: boolean;
    onClose: () => void;
    users?: UserInterface; // Datos del usuario a editar (opcional)
    roles: RolesInterface[];
    isEditing: boolean; // Indica si se está editando un usuario o creando uno nuevo
};

const ModalFormUser: React.FC<Props> = ({
    show,
    onClose,
    users,
    roles,
    isEditing,
}) => {
    const initialData = users || {
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

    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [users]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEditing && data?.user_id) {
            console.log("dentro update", data);
            patch(`/users/${data.user_id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            console.log("dentro create", data);
            post(route("user.create"), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-900">
                    {isEditing ? "Edit User Information" : "Create New User"}
                </h2>
                <div className="flex flex-col lg:flex-row lg:gap-4 lg:mt-4">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            className="mt-1 block w-full"
                            value={data.nombre} // Cambia esto a 'data.nombre' si usas 'data' directamente
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
                            value={data.ap_pat} // Cambia esto a 'data.ap_pat'
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
                            className="mt-1 block w-full"
                            value={data.ap_mat} // Cambia esto a 'data.ap_mat'
                            onChange={(e) => setData("ap_mat", e.target.value)}
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.ap_mat} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-4 lg:mt-4">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Correo Electronico"
                        />
                        <TextInput
                            id="email"
                            className="mt-1 block w-full"
                            value={data.email} // Cambia esto a 'data.email'
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
                            className="mt-1 block w-full"
                            value={data.ci} // Cambia esto a 'data.ci'
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
                            value={data.numero} // Cambia esto a 'data.numero'
                            onChange={(e) => setData("numero", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.numero} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-4 lg:mt-4">
                    <div>
                        <InputLabel htmlFor="genero" value="Genero" />
                        <SelectInput
                            isFocused
                            className="mt-1 block w-full"
                            required
                            onChange={(e) => setData("genero", e.target.value)} // Añade esta línea para manejar el cambio
                        >
                            {generos.map((item, index) => (
                                <option key={index} value={item.value}  selected={item.value === data.genero}>
                                    {item.label}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError className="mt-2" message={errors.genero} />
                    </div>
                    <div>
                        <InputLabel htmlFor="rol" value="Rol" />
                        <SelectInput
                            isFocused
                            className="mt-1 block w-full"
                            required
                            onChange={(e) => setData("rol", e.target.value)} // Añade esta línea para manejar el cambio
                        >
                            {roles.map((item, index) => (
                                <option key={index} value={item.name} selected={item.name === data.rol}>
                                    {item.name}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError className="mt-2" message={errors.rol} />
                    </div>
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
