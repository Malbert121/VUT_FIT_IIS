import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import ReservationsPage from "../Pages/ReservationsPage/ReservationsPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";
import OwnerReservationsPage from "../Pages/OwnerReservationsPage/OwnerReservationsPage";
import UnpaidReservationsPage from "../Pages/UnpaidReservationsPage/UnpaidReservationsPage";
import ReservationDetailPage from "../Pages/ReservationDetailPage/ReservationDetailPage";

export const pathConferences = "/conferences";
export const pathLectures = "/lectures";
export const pathReservations = "/reservations";
export const pathAdmin = "/admin";
export const pathAccount = "/account";
export const pathUnpaidReservations = `${pathReservations}/unpaids`
export const pathOwnerReservations = `${pathReservations}/owner`

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <PageContainer WrapperPage={MainPage} sideBarFlag={false}/>
            },
            {
                path: pathConferences,
                element: <PageContainer WrapperPage={ConferencesPage} sideBarFlag={true}/>
            },
            {
                path: `${pathConferences}/:id`, // Define the parameterized route for conference details
                element: <PageContainer WrapperPage={ConferenceDetailPage} sideBarFlag={true}/> // Add your ConferenceDetailPage component here
            },
            {
                path: pathLectures,
                element: <PageContainer WrapperPage={LecturesPage} sideBarFlag={true}/>
            },
            {
                path: pathReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationsPage} sideBarFlag={true}/>
            },
            {
                path: pathUnpaidReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={UnpaidReservationsPage} sideBarFlag={true}/>,
            },
            {
                path: pathOwnerReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={OwnerReservationsPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathReservations}/:reservationId`,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationDetailPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathAccount}/:userId`,
                element: <PageContainer WrapperPage={AccountPage} sideBarFlag={false}/>,
            },
            {
                path: pathAdmin,
                element: <PageContainer WrapperPage={AdminPanelPage} sideBarFlag={false}/>,
            },
            ]
            }
        ]
);
