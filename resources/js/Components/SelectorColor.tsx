interface ColorOption {
    nombre: string;
    valor: string;
  }
  
  interface SelectorDeColorProps {
    colores: ColorOption[];
    onColorSeleccionado: (color: string) => void;
    colorSeleccionado?: string; // Hacerlo opcional para evitar errores iniciales
  }
  
  export function SelectorDeColor({
    colores,
    onColorSeleccionado,
    colorSeleccionado,
  }: SelectorDeColorProps) {
    return (
      <div className="flex flex-wrap gap-2">
        {colores.map((color) => (
          <button
            key={color.valor}
            style={{
              backgroundColor: color.valor,
              width: '30px',
              height: '30px',
              border: '2px solid',
              borderColor:
                colorSeleccionado === color.valor ? 'blue' : 'transparent', // Resaltar el color seleccionado
              borderRadius: '50%', // Hacerlo circular
            }}
            onClick={() => onColorSeleccionado(color.nombre)}
            title={color.nombre} // Mostrar el nombre al pasar el ratón
            type="button" // Añadir type="button" para evitar comportamiento de formulario inesperado
          />
        ))}
      </div>
    );
  }
  