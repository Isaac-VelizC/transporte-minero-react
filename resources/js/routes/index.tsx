export const roleNavItems: Record<
    string,
    { href: string; icon: JSX.Element; label: string }[]
> = {
    Admin: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "user.list",
            icon: <i className="bi bi-people"></i>,
            label: "Usuarios",
        },
        {
            href: "vehicle.list",
            icon: <i className="bi bi-truck-front"></i>,
            label: "Vehiculos",
        },
        {
            href: "geocerca.list",
            icon: <i className="bi bi-geo-alt"></i>,
            label: "Geocercas",
        },
        {
            href: "envios.list",
            icon: <i className="bi bi-geo-fill"></i>,
            label: "Envios",
        }
    ],
    Secretaria: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "user.list",
            icon: <i className="bi bi-people"></i>,
            label: "Usuarios",
        },
        {
            href: "vehicle.list",
            icon: <i className="bi bi-truck-front"></i>,
            label: "Vehiculos",
        },
        {
            href: "envios.list",
            icon: <i className="bi bi-truck"></i>,
            label: "Envios",
        },
    ],
    Encargado_Control: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "geocerca.list",
            icon: <i className="bi bi-geo-alt"></i>,
            label: "Geocercas",
        },
        {
            href: "envios.list",
            icon: <i className="bi bi-truck"></i>,
            label: "Envios",
        },
        {
            href: "view.map",
            icon: <i className="bi bi-journals"></i>,
            label: "Reporte de Cambios",
        },
    ],
    Conductor: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "driver.envios.list",
            icon: <i className="bi bi-truck"></i>,
            label: "Envios",
        }
    ],
    Cliente: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "client.pedido.list",
            icon: <i className="bi bi-truck"></i>,
            label: "Pedidos",
        },
    ],
};
