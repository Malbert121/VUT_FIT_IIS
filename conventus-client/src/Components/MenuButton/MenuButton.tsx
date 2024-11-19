import React from 'react';
interface Props {
    action: ()=> void;
};
const MenuButton: React.FC<Props> = ({action})=>
{
    return(
        <>
        <button onClick={action} className="relative left-3 font-bold lg:flex space-x-6">
            <div className="flex flex-col space-y-1">
                <span className="block w-6 h-1 bg-gray-500"></span>
                <span className="block w-6 h-1 bg-gray-500"></span>
                <span className="block w-6 h-1 bg-gray-500"></span>
            </div>
        </button>
        </>
    );
}

export default MenuButton;