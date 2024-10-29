import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ConferencesPage from "../Pages/ConferencesPage/ConferencesPage";
import ConferenceDetailPage from "../Pages/ConferenceDetailPage/ConferenceDetailPage"; // Import your detail page
import LecturesPage from "../Pages/LecturesPage/LecturesPage";
import AccountPage from "../Pages/AccountPage/AccountPage";
import Tickets from "../Pages/TicketsPage/TicketsPage";
import MainPage from "../Pages/MainPage/MainPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <MainPage />
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
                element: <LecturesPage />
            },
            {
                path: "tickets",
                element: <Tickets />
            },
            {
                path: "account/:userId",
                element: <AccountPage />
            }
        ]
    }
]);
