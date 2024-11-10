import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import TicketsPage from "../Pages/TicketsPage/TicketsPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";
import OwnerTicketsPage from "../Pages/OwnerTicketsPage/OwnerTicketsPage";
import UnpaidUsersTicketsPage from "../Pages/UnpaidUsersTicketsPage/UnpaidTicketsPage";
import LoginPage from "../Pages/LoginPage/LoginPage"
import RegistrationPage from "../Pages/RegistrationPage/RegistrationPage";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";

export const pathConferences = "/conferences";
export const pathLectures = "/lectures";
export const pathTickets = "/tickets";
export const pathAdmin = "/admin";
export const pathAccount = "/account";
export const pathLogin = "/login";
export const pathRegistration = "/registration";
export const pathUnpaidTickets = `${pathTickets}/unpaids`
export const pathOwnerTickets = `${pathTickets}/owner`

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <PageContainer WrapperPage={MainPage} sideBarFlag={false} />
            },
            {
                path: pathConferences,
                element: <PageContainer WrapperPage={ConferencesPage} sideBarFlag={true} />
            },
            {
                path: `${pathConferences}/:id`, // Define the parameterized route for conference details
                element: <PageContainer WrapperPage={ConferenceDetailPage} sideBarFlag={true} /> // Add your ConferenceDetailPage component here
            },
            {
                path: pathLectures,
                element: <PageContainer WrapperPage={LecturesPage} sideBarFlag={true} />
            },
            {
                path: pathTickets,  // TODO: add usersId
                element: <PageContainer WrapperPage={TicketsPage} sideBarFlag={true} />
            },
            {
                path: pathUnpaidTickets,  // TODO: add usersId
                element: <PageContainer WrapperPage={UnpaidUsersTicketsPage} sideBarFlag={true} />,
            },
            {
                path: pathOwnerTickets,  // TODO: add usersId
                element: <PageContainer WrapperPage={OwnerTicketsPage} sideBarFlag={true} />,
            },
            {
                path: pathAccount,
                element: (
                    <ProtectedRoute>
                        <PageContainer WrapperPage={AccountPage} sideBarFlag={false} />
                    </ProtectedRoute>
                ),
            },
            {
                path: pathAdmin,
                element: <PageContainer WrapperPage={AdminPanelPage} sideBarFlag={false} />,
            },
            {
                path: pathLogin,
                element: <PageContainer WrapperPage={LoginPage} sideBarFlag={false} />,
            }, {
                path: pathRegistration,
                element: (
                    <PageContainer WrapperPage={RegistrationPage} sideBarFlag={false} />
                ),
            },
        ]
    }
]
);
