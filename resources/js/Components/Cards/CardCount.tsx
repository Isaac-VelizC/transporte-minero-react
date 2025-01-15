import React from "react";

type Props = {
    title: string;
    result: number;
    icon: string;
};

const CardCount: React.FC<Props> = ({ title, result, icon }) => {
    return (
        /* From Uiverse.io by EcheverriaJesus */
        <div className="flex items-center p-3 w-full h-24 bg-white rounded-xl shadow-lg">
            <section className="flex justify-center items-center w-14 h-14 rounded-full shadow-md bg-gradient-to-r from-[#F9C97C] to-[#a2c3e9] hover:from-[#C9A9E9] hover:to-[#7EE7FC] hover:cursor-pointer hover:scale-110 duration-300">
            <i className={`bi bi-${icon} text-2xl text-white`}></i>
            </section>

            <section className="block border-l border-gray-300 m-3">
                <div className="pl-3">
                    <h3 className="text-gray-600 font-semibold text-sm">
                        {title}
                    </h3>
                    <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-lg font-bold">
                        {result}
                    </h3>
                </div>
            </section>
        </div>
    );
};

export default CardCount;
