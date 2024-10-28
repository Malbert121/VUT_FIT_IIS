import React, {useState}  from 'react';
import SideBar from '../SideBar/SideBar';
import Navbar from '../Navbar/Navbar';
interface DefaultPage
{
    sideBarFlag: boolean;
    WrapperPage: React.ComponentType;
}
const PageContainer: React.FC<DefaultPage> = ({sideBarFlag, WrapperPage}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleSideBar = () => {
        setIsOpen(!isOpen);
    };
    return(
        <div>
        <Navbar updateSideBar={toggleSideBar}/>
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
            {sideBarFlag && isOpen? <SideBar/> : <></>}
            <WrapperPage/>
        </div>
        </div>
    );
};
export default PageContainer;