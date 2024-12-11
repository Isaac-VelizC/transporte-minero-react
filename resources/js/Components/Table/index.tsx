import DataTable, { TableColumn } from "react-data-table-component";
import customStyles from "@/styles/StylesTable";
import { useEffect, useState } from "react";

type Props<T> = {
    columns: TableColumn<T>[]; // Usa TableColumn de react-data-table-component
    data: T[];
};

const NoDataTable = () => {
    return (
        <div className="py-10">
            <p className="text-lg font-semibold">No hay Datos en la Tabla</p>
        </div>
    );
};

const LoadingTable = () => {
    return (
        <div className="h-50 flex justify-center items-center ">

            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        </div>
    );
};

const DataTableComponent = <T,>({ columns, data }: Props<T>) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos una carga de datos
        const timer = setTimeout(() => {
            setLoading(false); // Cambiamos el estado a false después de 2 segundos
        }, 2000);

        return () => clearTimeout(timer); // Limpiamos el timer si el componente se desmonta
    }, []);

    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={10} // Número de filas por página
            paginationRowsPerPageOptions={[5, 10, 20]}
            customStyles={customStyles}
            noDataComponent={<NoDataTable />}
            progressPending={loading} // Muestra el estado de carga
            progressComponent={<LoadingTable />} // Componente que se muestra durante la carga
            theme="dark"
        />
    );
};

export default DataTableComponent;
