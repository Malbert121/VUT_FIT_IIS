import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import Tickets from "../Pages/TicketsPage/TicketsPage";
import MainPage from "../Pages/MainPage/MainPage";


export const router = createBrowserRouter([
    {
        path: "/Conventus",
        element: <App />,
        children: [
            {
                path: "",
                element: <MainPage />
            },{
                path: "conferences",
                element: <ConferencesPage />
            },
            {
                path: "lectures",
                element: <LecturesPage></LecturesPage>
            },
            {
                path: "tickets",
                element: <Tickets></Tickets>
            },
            {
                path: "account/:userId",
                element: <AccountPage/>,
            }
            ]
            }
        ]
    
)