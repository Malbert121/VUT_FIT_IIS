import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";
import LoginPage from "../Pages/LoginPage/LoginPage"
import RegistrationPage from "../Pages/RegistrationPage/RegistrationPage";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import MyReservationsPage from "../Pages/MyReservationsPage/MyReservationsPage";
import ReservationDetailPage from "../Pages/ReservationDetailPage/ReservationDetailPage";
import GuestReservationsPage from "../Pages/GuestReservationsPage/GuestReservationsPage";
import LectureDetailPage from "../Pages/LectureDetailPage/LectureDetailPage";
import MyConferencesPage from "../Pages/MyConferencesPage/MyConferencesPage";
import NewConferencePage from "../Pages/NewConferencePage/NewConferencePage";

export const pathConferences = "/conferences";
export const pathMyConferences = "/myconferences";
export const pathCreateConference = "/myconferences/create";
export const pathLectures = "/lectures";
export const pathReservations = "/reservations";
export const pathAdmin = "/admin";
export const pathAccount = "/account";
export const pathLogin = "/login";
export const pathRegistration = "/registration";
export const pathMyReservations = pathReservations;
export const pathUnpaidReservations = `${pathReservations}/unpaids_reservations`;
export const pathGuestReservations = `${pathReservations}/guest_reservations`;

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
            }, {
                path: pathMyConferences,
                element: <PageContainer WrapperPage={MyConferencesPage} sideBarFlag={true} />
            },{
                path: pathCreateConference,
                element: <PageContainer WrapperPage={NewConferencePage} sideBarFlag={true} />
            },
            {
                path: `${pathConferences}/:id`,
                element: <PageContainer WrapperPage={ConferenceDetailPage} sideBarFlag={true} /> 
            },
            {
                path: pathLectures,
                element: <PageContainer WrapperPage={LecturesPage} sideBarFlag={true} />
            },
            {
                path: `${pathLectures}/:id`, // Define the parameterized route for lecture details.
                element: <PageContainer WrapperPage={LectureDetailPage} sideBarFlag={false}/> // Add your LectureDetailPage component here - TODO: side bar flag.
            },
            {
                path: pathMyReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={MyReservationsPage} sideBarFlag={true}/>
            },
            {
                path: pathGuestReservations,  // TODO: add usersId
                element: <PageContainer WrapperPage={GuestReservationsPage} sideBarFlag={true}/>,
            },
            {
                path: `${pathMyReservations}/:reservationId`,  // TODO: add usersId
                element: <PageContainer WrapperPage={ReservationDetailPage} sideBarFlag={true}/>,
            },
            {
                path: pathAccount,
                element: (
                   
                        <PageContainer WrapperPage={AccountPage} sideBarFlag={false} />
                   
                ),
            },
            {
                path: pathAdmin,
                element: <PageContainer WrapperPage={AdminPanelPage} sideBarFlag={false} />,
            },
            {
                path: pathLogin,
                element: (
                    <ProtectedRoute>
                        <PageContainer WrapperPage={LoginPage} sideBarFlag={false} />
                    </ProtectedRoute>
                ),
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
