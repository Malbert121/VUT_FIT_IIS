import React, {useState}  from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from '../SideBar/SideBar';
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
        <div className="flex"> 
            {sideBarFlag?<SideBar/>:null}   
            <div className='flex flex-col w-full'>
                <Navbar updateSideBar={toggleSideBar}/>
                <div className="w-full flex relative ct-docs-disable-sidebar-content overflow-x-hidden">
                    <WrapperPage/>
                </div>
            </div>
        </div>
    );
};
export default PageContainer;
