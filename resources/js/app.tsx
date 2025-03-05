import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../../js/service-worker.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.error("Error al registrar Service Worker", err));
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <BrowserRouter>
                <App {...props} />
            </BrowserRouter>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
