import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import Tickets from "../Pages/TicketsPage/TicketsPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";

export const pathConferences = "/Conventus/conferences";
export const pathLectures = "/Conventus/lectures";
export const pathTickets = "/Conventus/tickets";
export const pathAdmin = "/Conventus/admin";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <PageContainer WrapperPage={MainPage} sideBarFlag={false}/>
            },{
                path: "conferences",
                element: <PageContainer WrapperPage={ConferencesPage} sideBarFlag={true}/>
            },
            {
                path: "conferences",
                element: <ConferencesPage />

            }, {
                path: "conferences/:id", // Define the parameterized route for conference details
                element: <ConferenceDetailPage /> // Add your ConferenceDetailPage component here
            },

            {
                path: "lectures",
                element: <PageContainer WrapperPage={LecturesPage} sideBarFlag={true}/>
            },
            {
                path: "tickets",
                element: <PageContainer WrapperPage={Tickets} sideBarFlag={true}/>
            },
            {
                path: "account/:userId",
                element: <PageContainer WrapperPage={AccountPage} sideBarFlag={false}/>,
            },
            {
                path: "admin",
                element: <PageContainer WrapperPage={AdminPanelPage} sideBarFlag={false}/>,
            }
            ]
            }
        ]
    }
]);
