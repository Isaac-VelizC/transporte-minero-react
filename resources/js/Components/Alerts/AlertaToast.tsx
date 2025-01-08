import toast from "react-hot-toast";
import SecondaryButton from "../Buttons/SecondaryButton";

type Props = {
    message: string;
    deviceName: string;
};

export const alertToast = ({ message, deviceName }: Props) => {
    toast((t) => (
        <span className="flex items-center justify-between gap-2">
            <p>
                {message} <b>{deviceName}</b>
            </p>
            <SecondaryButton onClick={() => toast.dismiss(t.id)}>
                Aceptar
            </SecondaryButton>
        </span>
    ));
};
