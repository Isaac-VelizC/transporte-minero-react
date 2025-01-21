
import Guest from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
type Props = {};

export default function Error404({}: Props) {
    return (
        <Guest>
            <Head title="404" />
            <div className="p-8 rounded-md text-center">
                <h1 className="text-2xl font-semibold">El dispositivo no esta registrado en al base de datos</h1>
                <br />
                <Link href={route("logout")} method="post" className="bg-red-600 rounded-lg py-2 px-6 text-white">
                    Salir
                </Link>
            </div>
        </Guest>
    );
}
