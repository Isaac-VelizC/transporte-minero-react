import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    classNames?: string;
};

const Card: React.FC<Props> = ({ children, classNames = '' }) => {
    return (
        <div className={`bg-gray-300 rounded-lg p-4 shadow-md text-gray-500 ${classNames}`}>
            {children}
        </div>
    );
};

export default Card;
