import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "@/Components/ClickOutside";
import axios from "axios";
import { NotificationInterface } from "@/interfaces/Notification";

const DropdownNotification = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [notifications, setNotifications] = useState<NotificationInterface[]>(
        []
    );
    // Obtener notificaciones desde Laravel
    useEffect(() => {
        axios
            .get(route("all.notification"), { withCredentials: true })
            .then((res) => {
                setNotifications(res.data);
                if (res.data.length > 0) {
                    setNotifying(true);
                } else {
                    setNotifying(false);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // Marcar notificación como leída
    const handleNotificationClick = (id: number, actionURL: string) => {
        axios
            .get(route("admin.notification", id))
            .then(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                if (notifications.length === 1) setNotifying(false); // Si ya no hay notificaciones
                window.location.href = actionURL;
            })
            .catch((err) => console.error(err));
    };

    return (
        <ClickOutside
            onClick={() => setDropdownOpen(false)}
            className="relative"
        >
            <li>
                <Link
                    onClick={() => {
                        setNotifying(false);
                        setDropdownOpen(!dropdownOpen);
                    }}
                    to="#"
                    className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                    <span
                        className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
                            notifying === false ? "hidden" : "inline"
                        }`}
                    >
                        <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                    </span>

                    <i className="bi bi-bell"></i>
                </Link>

                {dropdownOpen && (
                    <div
                        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
                    >
                        <div className="px-4.5 py-3">
                            <h5 className="text-sm font-medium text-bodydark2">
                                Notificaciones
                            </h5>
                        </div>

                        <ul className="flex h-auto flex-col overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <li key={notification.id}>
                                        <button
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.data.actionURL
                                                )
                                            }
                                            className="w-full text-left flex gap-3 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                                        >
                                            <i
                                                className={`fa ${notification.data.fas}`}
                                            ></i>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm text-gray-500 font-semibold">
                                                    {notification.data.title}
                                                </span>
                                                <small className="text-xs text-gray-500">
                                                    {new Date(
                                                        notification.read_at
                                                    ).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4.5 py-3 text-sm text-gray-500">
                                    No hay notificaciones
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </li>
        </ClickOutside>
    );
};

export default DropdownNotification;
