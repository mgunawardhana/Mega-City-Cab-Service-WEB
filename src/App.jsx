import NavBar from "./components/NavBar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import TopRatedServices from "./components/TopRatedServices.jsx";
import ExploreComponent from "./components/ExploreComponent.jsx";
import Exceptional from "./components/Exceptional.jsx";
import FooterSection from "./components/FooterSection.jsx";



function App() {

    return (<>
        <NavBar/>
        <LandingPage/>
        <TopRatedServices/>
        {/*<ExploreComponent/>*/}
        <Exceptional/>
        <FooterSection/>
    </>)
}

export default App
