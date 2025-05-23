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
            href: "devices.list",
            icon: <i className="bi bi-phone"></i>,
            label: "Dispositivos",
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
        },
        {
            href: "admin.page.packups",
            icon: <i className="bi bi-shield-lock"></i>,
            label: "Copias de Seguridad",
        }
    ],
    Secretaria: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "clients.list",
            icon: <i className="bi bi-person-check"></i>,
            label: "Clientes",
        },
        {
            href: "drivers.list",
            icon: <i className="bi bi-person-bounding-box"></i>,
            label: "Conductores",
        },
        {
            href: "vehicle.list",
            icon: <i className="bi bi-truck-front"></i>,
            label: "Vehiculos",
        },
        /*{
            href: "mantenimiento.list",
            icon: <i className="bi bi-gear"></i>,
            label: "Mantenimientos",
        },*/
        {
            href: "devices.list",
            icon: <i className="bi bi-phone"></i>,
            label: "Dispositivos",
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
            href: "mantenimiento.list",
            icon: <i className="bi bi-gear"></i>,
            label: "Mantenimientos",
        },
        {
            href: "view.message",
            icon: <i className="bi bi-chat"></i>,
            label: "Mensajes",
        },
    ],
    Conductor: [
        {
            href: "dashboard",
            icon: <i className="bi bi-columns-gap"></i>,
            label: "Dashboard",
        },
        {
            href: "driver.show.map",
            icon: <i className="bi bi-map"></i>,
            label: "Envios",
        },
        {
            href: "driver.mantenimientos.list",
            icon: <i className="bi bi-gear"></i>,
            label: "Mantenimientos",
        },
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
