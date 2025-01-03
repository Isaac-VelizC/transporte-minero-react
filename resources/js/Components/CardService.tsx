import React from "react";

type Props = {
    title: string;
    description: string;
    icon?: string;
};

const CardService: React.FC<Props> = ({ title, description }) => {
    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
            <div className="service-item">
                <div className="service-single">
                    <div className="service-icon">
                        <i className="fi flaticon-truck"></i>
                    </div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default CardService