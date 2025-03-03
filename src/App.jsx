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

// A wrapper component to conditionally render NavBar and FooterSection
function AppContent() {
    const location = useLocation();
    // Hide NavBar and FooterSection on /signin, /signup, /booking, and /bill
    const hideNavBarAndFooter = ["/signin", "/signup", "/booking", "/bill"].includes(location.pathname);

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
                <Route path="/signup" element={<SignUpPage />} /> {/* Add the signup route */}
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/bill" element={<BillPage />} />
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