
const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#64748B', // Color de fondo del encabezado
            color: 'white', // Color del texto del encabezado
        },
    },
    rows: {
        style: {
            backgroundColor: '#f9f9f9', // Color de fondo por defecto de las filas
            color: '#333', // Color del texto por defecto
            minHeight: '50px', // Altura mínima de las filas
            '&:nth-child(odd)': {
                backgroundColor: '#e0e0e0', // Color de fondo para filas impares
            },
            '&:hover': {
                backgroundColor: '#d1e7dd', // Color al pasar el mouse sobre la fila
            },
        },
    },
    pagination: {
        style: {
            backgroundColor: '#AEB7C0',
        },
    },
};

export default customStyles;