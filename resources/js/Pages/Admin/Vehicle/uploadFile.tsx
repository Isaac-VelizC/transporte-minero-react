import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Card from "@/Components/Cards/Card";
import InputError from "@/Components/Forms/InputError";
import { Head, useForm } from "@inertiajs/react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    vehicleId: number; // ID del vehículo
    currentImage?: string; // URL de la imagen actual del vehículo
};

const UploadVehicleImage: React.FC<Props> = ({ vehicleId, currentImage }) => {
    const { data, setData, post, errors, processing } = useForm({
        image: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.image) {
            toast.error("Debes seleccionar una imagen");
            return;
        }

        post(route("vehicle.upload.file", vehicleId), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Imagen subida correctamente");
                setData("image", null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
            onError: () => {
                toast.error("Error al subir la imagen");
            },
        });
    };

    return (
        <Card>
            <div className=" rounded-xl p-6 flex flex-col gap-6">
                <form
                    onSubmit={handleSubmit}
                    className="flex md:flex-row flex-col items-center gap-6 w-full"
                >
                    {/* Imagen actual */}
                    {currentImage && (
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-gray-300 text-sm">
                                Imagen actual:
                            </span>
                            <img
                                src={`${import.meta.env.VITE_URL_STORAGE}/${currentImage}`}
                                alt="Imagen actual del vehículo"
                                className="w-48 h-48 object-cover rounded-xl border border-gray-500"
                            />
                        </div>
                    )}

                    {/* Preview de nueva imagen */}
                    {preview && (
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-gray-300 text-sm">
                                Nueva imagen seleccionada:
                            </span>
                            <img
                                src={preview}
                                alt="Vista previa nueva imagen"
                                className="w-48 h-48 object-cover rounded-xl border border-green-500"
                            />
                        </div>
                    )}

                    {/* Botón de seleccionar imagen */}
                    <label
                        htmlFor="image"
                        className="cursor-pointer flex flex-col items-center justify-center w-48 h-48 bg-gray-700 border-2 border-dashed border-gray-400 rounded-xl hover:bg-gray-500 transition"
                    >
                        <span className="text-gray-200">Seleccionar Imagen</span>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <InputError className="mt-2" message={errors.image} />

                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "Subiendo..." : "Actualizar Imagen"}
                    </PrimaryButton>
                </form>
            </div>
        </Card>
    );
};

export default UploadVehicleImage;
