import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage";
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import MainPage from "../Pages/MainPage/MainPage";
import AdminPanelPage from "../Pages/AdminPanelPage/AdminPanelPage";
import PageContainer from "../Components/PageContainer/PageContainer";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import MyReservationsPage from "../Pages/MyReservationsPage/MyReservationsPage";
import ReservationDetailPage from "../Pages/ReservationDetailPage/ReservationDetailPage";
import GuestReservationsPage from "../Pages/GuestReservationsPage/GuestReservationsPage";
import LectureDetailPage from "../Pages/LectureDetailPage/LectureDetailPage";
import MyConferencesPage from "../Pages/MyConferencesPage/MyConferencesPage";
import NewConferencePage from "../Pages/NewConferencePage/NewConferencePage";
import ConferenceEditPage from "../Pages/ConferencesEditPage/ConferenceEditPage";
import MyLecturesPage from "../Pages/MyLecturesPage/MyLecturesPage";
import EditLecturePage from "../Pages/EditLecturePage/EditLecturePage";
import NewLecturePage from "../Pages/NewLecturePage/NewLecturePage";

export const pathConferences = "/conferences";
export const pathMyConferences = "/myconferences";
export const pathCreateConference = "/myconferences/create";
export const pathEditConference = "/myconferences/edit";
export const pathLectures = "/lectures";
export const pathMyLectures = "/lectures/mylectures";
export const pathCreateLecture = "/lectures/create";
export const pathEditLecture = "/lectures/edit";
export const pathReservations = "/reservations";
export const pathAdmin = "/admin";
export const pathAccount = "/account";
export const pathMyReservations = pathReservations;
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
            },
            {
                path: pathMyConferences,
                element: <PageContainer WrapperPage={MyConferencesPage} sideBarFlag={true} />
            },
            {
                path: pathCreateConference,
                element: <PageContainer WrapperPage={NewConferencePage} sideBarFlag={true} />
            },
            {
                path: `${pathConferences}/:id`,
                element: <PageContainer WrapperPage={ConferenceDetailPage} sideBarFlag={true} /> 
            },
            {
                path: `${pathEditConference}/:id`,
                element: <PageContainer WrapperPage={ConferenceEditPage} sideBarFlag={true} /> 
            },
            {
                path: pathLectures,
                element: <PageContainer WrapperPage={LecturesPage} sideBarFlag={true} />
            },
            {
                path: pathMyLectures,
                element: <PageContainer WrapperPage={MyLecturesPage} sideBarFlag={true} />
            },
            {
                path: pathCreateLecture,
                element: <PageContainer WrapperPage={NewLecturePage} sideBarFlag={true} />
            },
            {
                path: `${pathLectures}/:id`,
                element: <PageContainer WrapperPage={LectureDetailPage} sideBarFlag={true} />
            },
            {
                path: `${pathEditLecture}/:id`,
                element: <PageContainer WrapperPage={EditLecturePage} sideBarFlag={true} />
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
        ]
    }
]
);
