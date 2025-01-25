import { useEffect, useState } from "react";
import api from "../services/services.js";
import CustomLoader from "./CustomLoader.jsx";
import { FETCH_ARTICLE_ENDPOINT } from "../services/routes/articleRoute.js";
//import image from assets
import image from "./../assets/Leonardo_Phoenix_10_A_highly_detailed_and_realistic_scene_of_a_0 (2).jpg";


export default function TopRatedServices() {
    const [loadPosts, setLoadPosts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.post(FETCH_ARTICLE_ENDPOINT);
            console.log("Fetched data:", response.data.result);
            setLoadPosts(response.data.result);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedCard(null);
    };

    const Popup = ({ card, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg p-6 w-[90%] md:w-[50%]">
                <button
                    className="absolute top-3 right-3 bg-[#ffa502] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-yellow-600 transition duration-300"
                    onClick={onClose}
                >
                    ✖
                </button>
                <img
                    src={card.media}
                    alt={card.title}
                    className="rounded-lg w-full h-80 object-cover mb-4"
                />
                <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
                <p className="text-gray-700">{card.description}</p>
            </div>
        </div>
    );


    const Card = ({ image, heading, ratings, card }) => {
        return (
            <div
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleCardClick(card)}
            >
                <div className="relative">
                    <img
                        src={image}
                        alt="TopRatedServices Destination"
                        className="rounded-t-2xl w-full h-[300px] object-cover"
                    />
                    <p className="bg-white text-[#ffa502] font-semibold rounded-lg p-1 text-sm absolute top-4 right-4">
                        {ratings}%
                    </p>
                </div>
                <div className="p-4">
                    <h5 className="text-xl font-semibold">{heading}</h5>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6">
            <section className="pt-16 text-center">
                <h2 className="text-4xl font-bold">Rated Cab Service News</h2>
                <p className="py-4 text-gray-600">At Mega City Cab Service</p>
                <div className="text-gray-500 lg:w-2/5 mx-auto">
                    The cab service stands as a leading private sector transportation provider, boasting a dominant presence across the entire mobility and travel value chain.
                </div>
                <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-12">
                    {loadPosts.length > 0 ? (
                        loadPosts.map((card, index) => (
                            <Card
                                key={index}
                                image={card.media}
                                heading={card.title}
                                ratings={card.ratings}
                                card={card}
                            />
                        ))
                    ) : (
                        <div></div>
                        // <CustomLoader/>
                    )}
                </div>
            </section>

            <section className="py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Find Your Ride That Fits Your Lifestyle</h1>
                    <p className="text-lg text-gray-600">Explore popular travel and cab options tailored to your needs from around the world.</p>
                </div>
                <div className="lg:flex items-center justify-between py-16 gap-12">
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <span className="bg-[#ffa502] text-white px-3 py-1 rounded-xl">01</span>
                            <h2 className="font-bold text-lg py-4">Find Rides That Fit Your Lifestyle</h2>
                            <p className="text-gray-500">
                                Explore personalized transportation options designed to meet your travel needs and preferences.
                            </p>
                        </div>
                        <div>
                            <span className="bg-[#ffa502] text-white px-3 py-1 rounded-xl">02</span>
                            <h2 className="font-bold text-lg py-4">Embrace Convenience Through Reliable Travel</h2>
                            <p className="text-gray-500">
                                Discover unique cab services and seamless travel experiences to enhance your daily journeys.
                            </p>
                        </div>
                        <div>
                            <span className="bg-[#ffa502] text-white px-3 py-1 rounded-xl">03</span>
                            <h2 className="font-bold text-lg py-4">Rediscover the Joy of Traveling</h2>
                            <p className="text-gray-500">
                                Reignite your love for exploration with dynamic routes and trusted cab services tailored for you.
                            </p>
                        </div>
                        <button
                            className="bg-[#ffa502] text-white px-6 py-3 rounded-xl shadow hover:bg-white hover:text-[#ffa502] border-[#ffa502] transition-colors duration-300"
                        >
                            Explore More
                        </button>
                    </div>
                    <div className="lg:w-1/2 overflow-hidden rounded-2xl">
                        <img
                            src={image}
                            alt="Mountain view"
                            className="rounded-2xl w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {showPopup && selectedCard && (
                <Popup card={selectedCard} onClose={closePopup} />
            )}
        </div>
    );
}
