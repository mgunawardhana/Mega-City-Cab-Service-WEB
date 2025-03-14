import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import api from "../services/services.js";
import { CUSTOMER_PROGRESS } from "../services/routes/customerImprovements.js";

export default function Exceptional() {
    const [bestPerformers, setBestPerformers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchData = async () => {
        try {
            const response = await api.post(CUSTOMER_PROGRESS);
            console.log("Fetched Driver Details:", response.data.result);

            // Filter for drivers only and map the data
            const drivers = response.data.result
                .filter((driver) => driver.role === "DRIVER")
                .map((driver) => ({
                    firstName: driver.firstName || "Driver", // Fallback if firstName is missing
                    lastName: driver.lastName || driver.driver_nic, // Use lastName or driver_nic
                    status: driver.driverStatus || "Active", // Fallback status if missing
                    media: driver.user_profile_pic || "https://via.placeholder.com/150", // Placeholder image if missing
                }));

            setBestPerformers(drivers);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? bestPerformers.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === bestPerformers.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <h2 className="text-4xl font-bold text-center">
                Embark on a Journey Toward Exceptional Travel.
            </h2>
            <p className="text-gray-600 text-center mt-2">
                Our reliable cab services are strategically located, providing seamless
                access to premium transportation options and expert drivers.
            </p>

            <div className="flex items-center justify-center mt-8 space-x-4">
                {/* Left Arrow */}
                <button onClick={goToPrevious} className="text-gray-600 hover:text-black">
                    <FaArrowLeft size={24} />
                </button>

                {/* Carousel Container */}
                <div className="flex space-x-4 overflow-hidden w-full max-w-4xl">
                    {bestPerformers.length > 0 ? (
                        bestPerformers.slice(currentIndex, currentIndex + 4).map((performer, index) => (
                            <div
                                key={index}
                                className="relative bg-white shadow-lg rounded-lg overflow-hidden flex-shrink-0 w-48 h-64 m-3"
                            >
                                <HiOutlinePaperAirplane
                                    className="absolute top-3 left-3 text-[#ffa502]"
                                    size={24}
                                />
                                <img
                                    src={performer.media}
                                    alt={`${performer.firstName} ${performer.lastName}`}
                                    className="w-full h-52 object-cover rounded-t-lg"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback image on error
                                />
                                <div className="p-4 text-center">
                                    <p className="text-lg font-semibold">
                                        {performer.firstName.toUpperCase()} {performer.lastName.toUpperCase()}
                                    </p>
                                    <p className="text-sm text-gray-500">{performer.status}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No drivers available</p>
                    )}
                </div>

                {/* Right Arrow */}
                <button onClick={goToNext} className="text-gray-600 hover:text-black">
                    <FaArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}