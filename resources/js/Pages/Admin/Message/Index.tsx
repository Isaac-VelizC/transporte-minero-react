import Card from "@/Components/Cards/Card";
import TextInput from "@/Components/Forms/TextInput";
import { PersonaMessageInterface } from "@/interfaces/Message";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    messages: PersonaMessageInterface[];
};

interface FormData {
    body: string;
    client_id: number | null;
}

export default function Index({ messages }: Props) {
    const [selectedUser, setSelectedUser] =
        useState<PersonaMessageInterface | null>(null);

    const { data, setData, post, processing, reset } = useForm<FormData>({
        body: "",
        client_id: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.error("Selecciona un usuario antes de enviar un mensaje.");
            return;
        }
        // Primero, aseguramos que client_id se establece antes de hacer el POST
        setData((prevData) => ({
            ...prevData,
            client_id: selectedUser.id,
        }));
        if (data.client_id != null) {
            // Ejecutamos el post en un callback para garantizar que setData se aplicó
            post(route("send.message.control"), {
                onSuccess: ({ props: { flash } }) => {
                    if (flash.error) toast.error(flash.error);
                    if (flash.success) toast.success(flash.success);
                    reset();
                    setSelectedUser(null);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    return (
        <Authenticated>
            <Head title="Messages" />

            <div className="container mx-auto shadow-lg rounded-lg">
                <Card classNames="flex flex-row justify-between">
                    {/* Lista de usuarios */}
                    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                        {messages.map((usuario, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedUser(usuario)}
                                className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer ${
                                    selectedUser?.id === usuario.id
                                        ? "bg-gray-300"
                                        : ""
                                }`}
                            >
                                <div className="hidden md:block w-1/4">
                                    <img
                                        src="https://i.pinimg.com/236x/0e/4f/cc/0e4fcc685b53e6fe59883e8b1e2aa67d.jpg"
                                        className="object-cover h-12 w-12 rounded-full"
                                        alt="Perfil"
                                    />
                                </div>
                                <div className="w-full">
                                    <div className="text-lg font-semibold">
                                        {usuario.nombre} {usuario.ap_pat}{" "}
                                        {usuario.ap_mat}
                                    </div>
                                    {usuario.messages &&
                                        usuario.messages.length > 0 && (
                                            <span className="text-gray-500">
                                                {usuario.messages[0].body}
                                            </span>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat del usuario seleccionado */}
                    <div className="w-full px-5 flex flex-col justify-between">
                        <div className="flex flex-col mt-5">
                            {selectedUser ? (
                                <div>
                                    <div className="text-xl font-semibold text-center mb-4">
                                        Chat con {selectedUser.nombre}
                                    </div>
                                    {selectedUser.messages?.map(
                                        (mensaje, mensajeIndex) => (
                                            <div
                                                key={mensajeIndex}
                                                className={`flex ${
                                                    mensaje.receptor === "admin"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                } mb-2`}
                                            >
                                                <div
                                                    className={`ml-2 py-1 px-4 ${
                                                        mensaje.receptor ===
                                                        "admin"
                                                            ? "bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                                            : "bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                                    }`}
                                                >
                                                    {mensaje.body}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center mt-10">
                                    Selecciona un usuario para ver sus mensajes
                                </div>
                            )}
                        </div>

                        {/* Input para enviar mensaje */}
                        {selectedUser && (
                            <div className="py-5">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex"
                                >
                                    <TextInput
                                        className="w-full bg-gray-300 py-3 px-3 rounded-xl"
                                        type="text"
                                        value={data.body}
                                        onChange={(e) =>
                                            setData("body", e.target.value)
                                        }
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                    <button
                                        type="submit"
                                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl"
                                        disabled={processing}
                                    >
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </Authenticated>
    );
}
