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
            const response = await api.get(CUSTOMER_PROGRESS);
            console.log("Fetched Driver Details:", response.data.result);
            setBestPerformers(
                response.data.result.map((driver) => ({
                    firstName: driver.driverNIC,
                    lastName: driver.driverNIC,
                    status: driver.driverStatus,
                    media: driver.user_profile_pic, // Use user_profile_pic field here
                }))
            );
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
                    {bestPerformers.slice(currentIndex, currentIndex + 4).map((performer, index) => (
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
                            />
                            <div className="p-4 text-center">
                                <p className="text-lg font-semibold">
                                    {performer.firstName.toUpperCase()} {performer.lastName.toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-500">{performer.status}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button onClick={goToNext} className="text-gray-600 hover:text-black">
                    <FaArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}
