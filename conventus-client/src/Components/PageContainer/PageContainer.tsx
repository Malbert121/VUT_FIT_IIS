import React from 'react';
import SideBar from '../SideBar/SideBar';
interface DefaultPage
{
    sideBarFalg: boolean;
    WrapperPage: React.ComponentType;
}
const PageContainer: React.FC<DefaultPage> = ({sideBarFalg, WrapperPage}) => {
    return(
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
            {sideBarFalg? <SideBar/> : <></>}
            <WrapperPage/>
        </div>
    );
};
export default PageContainer;