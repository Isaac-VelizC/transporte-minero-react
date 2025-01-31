import TextInput from "@/Components/Forms/TextInput";
import { MessageInterface } from "@/interfaces/Message";
import { useForm } from "@inertiajs/react";
import React from "react";
import toast from "react-hot-toast";

type Props = {
    messages?: MessageInterface[];
};

interface FormData {
    body: string;
}

const MensajesCliente = ({ messages }: Props) => {
    const { data, setData, post, processing, reset } = useForm<FormData>({
        body: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Ejecutamos el post en un callback para garantizar que setData se aplicó
        post(route("send.message"), {
            onSuccess: ({ props: { flash } }) => {
                if (flash.error) toast.error(flash.error);
                if (flash.success) toast.success(flash.success);
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };
    return (
        <div className="w-full px-5 flex flex-col justify-between">
            <div className="flex flex-col mt-5">
                <div>
                    <div className="text-xl font-semibold text-center mb-4">
                        Chat con el encargado del control
                    </div>
                    {messages?.map((mensaje, mensajeIndex) => (
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
                                    mensaje.receptor === "admin"
                                        ? "bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                        : "bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                }`}
                            >
                                {mensaje.body}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input para enviar mensaje */}
            <div className="py-5">
                <form method="post" onSubmit={handleSubmit} className="flex">
                    <TextInput
                        className="w-full bg-gray-300 py-3 px-3 rounded-xl"
                        type="text"
                        value={data.body}
                        onChange={(e) => setData("body", e.target.value)}
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
        </div>
    );
};

export default MensajesCliente;
