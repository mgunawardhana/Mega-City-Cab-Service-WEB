import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import TopRatedServices from "./components/TopRatedServices.jsx";
import ExploreComponent from "./components/ExploreComponent.jsx";
import Exceptional from "./components/Exceptional.jsx";
import FooterSection from "./components/FooterSection.jsx";
import SignInPage from "./components/SignInPage.jsx";
import BookingPage from "./components/BookingPage.jsx";
import BillPage from "./components/BillPage.jsx";
import SignUpPage from "./components/SignUpPage.jsx";
import DriverDashboard from "./components/DriverDashboard.jsx"; // New component for drivers

function AppContent() {
    const location = useLocation();
    const hideNavBarAndFooter = ["/signin", "/signup", "/booking", "/bill", "/driver-dashboard"].includes(location.pathname);

    return (
        <>
            {!hideNavBarAndFooter && <NavBar />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <LandingPage />
                            <TopRatedServices />
                            <ExploreComponent />
                            <Exceptional />
                        </>
                    }
                />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/bill" element={<BillPage />} />
                <Route path="/driver-dashboard" element={<DriverDashboard />} /> {/* New driver route */}
            </Routes>
            {!hideNavBarAndFooter && <FooterSection />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;