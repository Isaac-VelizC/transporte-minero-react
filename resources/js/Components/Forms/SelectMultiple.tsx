import React from "react";

// Definición de tipos para las opciones
interface Option {
    id: number; // ID como número
    label: string;
}

// Propiedades del componente SelectMultiple
interface SelectMultipleProps {
    options: Option[];
    value: number[]; // Cambia a un array de números
    onChange: (selectedValues: number[]) => void; // Asegúrate de que el tipo sea correcto
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({
    options,
    value,
    onChange,
}) => {
    
    const handleOptionClick = (optionValue: number) => {
        const newSelectedValues = value.includes(optionValue)
            ? value.filter((item) => item !== optionValue) // Eliminar si ya está seleccionado
            : [...value, optionValue]; // Agregar si no está seleccionado

        onChange(newSelectedValues); // Actualizar el estado en el componente padre
    };

    return (
        <div className="relative">
            <select
                multiple
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full"
                style={{ display: "none" }} // Ocultar el select nativo
            >
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="border rounded p-2">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`cursor-pointer text-white ${
                            value.includes(option.id) ? "bg-gray-400" : ""
                        }`}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

 export default SelectMultiple