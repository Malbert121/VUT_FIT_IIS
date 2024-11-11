import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import ReservationsPage from "../Pages/AvailableReservationPage/AvailableReservationPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";
import OwnerTicketsPage from "../Pages/OwnerTicketsPage/OwnerTicketsPage";
import UnpaidUsersTicketsPage from "../Pages/UnpaidUsersTicketsPage/UnpaidTicketsPage";
import LoginPage from "../Pages/LoginPage/LoginPage"
import RegistrationPage from "../Pages/RegistrationPage/RegistrationPage";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import UnpaidReservationsPage from "../Pages/UnpaidReservationsPage/UnpaidReservationsPage";
import ReservationDetailPage from "../Pages/ReservationDetailPage/ReservationDetailPage";
import GuestReservationsPage from "../Pages/GuestReservationsPage/GuestReservationsPage";

export const pathConferences = "/conferences";
export const pathLectures = "/lectures";
export const pathReservations = "/reservations";
export const pathAdmin = "/admin";
export const pathAccount = "/account";
export const pathAvailableReservations = pathReservations
export const pathUnpaidReservations = `${pathReservations}/unpaids_reservations`
export const pathGuestReservations = `${pathReservations}/guest_reservations`
export const pathLogin = "/login";
export const pathRegistration = "/registration";
export const pathUnpaidTickets = `${pathTickets}/unpaids`
export const pathOwnerTickets = `${pathTickets}/owner`
export const pathAdminConferenceDetail = `${pathAdmin}/Conferences`


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
                path: pathAvailableReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationsPage} sideBarFlag={true}/>
            },
            {
                path: pathUnpaidReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={UnpaidReservationsPage} sideBarFlag={true}/>,
            },
            {
                path: pathGuestReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={GuestReservationsPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathAvailableReservations}/:reservationId`,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationDetailPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathGuestReservations}/:reservationId`,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationDetailPage} sideBarFlag={true}/>,
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
                path: `${pathAdmin}/:showShow`,
                element: <PageContainer WrapperPage={AdminPanelPage} sideBarFlag={true} />,
                path: `${pathUnpaidReservations}/:reservationId`,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationDetailPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathAdminConferenceDetail}/:id`,
                element: <PageContainer WrapperPage={ConferenceDetailPage} sideBarFlag={true} />,
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
