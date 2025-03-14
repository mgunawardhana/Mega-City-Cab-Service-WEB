import React, { useEffect, useState } from "react";
import { HiOutlineLocationMarker, HiOutlineShoppingCart } from "react-icons/hi";
import api from "../services/services.js";
import { GET_SUPPLEMENT_ENDPOINT } from "../services/routes/supplementRoute.js";

export default function ExploreComponent() {
    const [loadSupplements, setLoadSupplements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedSupplement, setSelectedSupplement] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get(GET_SUPPLEMENT_ENDPOINT);
            console.log("Fetched Data sssssssssssssss:", response.data.result);

            const transformedData = response.data.result.map((item) => {
                let media = item.vehicleImage;

                if (media && !media.startsWith("http") && !media.startsWith("data:image")) {
                    media = `data:image/jpeg;base64,${media}`;
                } else if (!media) {
                    media = "https://via.placeholder.com/200";
                }

                return {
                    id: item.id,
                    name: `${item.make} ${item.model}`,
                    media,
                    description: `${item.color} ${item.yearOfManufacture} ${item.vehicleType}`,
                    price: item.engineCapacity,
                    category: item.fuelType,
                    supplierName: item.ownerName,
                    isAvailable: item.status === "AVAILABLE", // Updated condition based on status
                    rating: 5,
                };
            });

            setLoadSupplements(transformedData);
            const uniqueCategories = ["All", ...new Set(transformedData.map((item) => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredSupplements = loadSupplements.filter(
        (supplement) => activeCategory === "All" || supplement.category === activeCategory
    );

    const PopupCard = ({ product, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[380px] p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200"
                >
                    ✖
                </button>

                <div className="flex justify-center mb-4">
                    <img
                        src={product.media || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="h-full object-fit"
                    />
                </div>

                <h2 className="text-2xl font-bold text-center">{product.name}</h2>
                <p className="text-center text-gray-500 mb-4">{product.description || "No description available."}</p>

                <div className="flex justify-center mb-4 text-yellow-500 text-xl">
                    {"★".repeat(product.rating || 5).padEnd(5, "☆")}
                </div>

                <p className="text-center text-2xl font-bold mb-4">{product.price || "N/A"}</p>

                <div className="flex justify-between items-center space-x-2">
                    <button
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 text-sm h-10"
                    >
                        <HiOutlineShoppingCart size={18} /> Book Now
                    </button>

                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow text-sm h-10">
                        <img
                            src="https://img.icons8.com/?size=100&id=HxdvwPmtGaQL&format=png&color=000000"
                            alt="Verified Icon"
                            className="w-5 h-5"
                        />
                        <span className="text-green-500 font-semibold">VERIFIED</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-10">
            <h2 className="text-4xl font-bold text-center">Explore more</h2>
            <p className="text-gray-600 text-center mt-2">Let's go on an adventure</p>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-lg ${
                            activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-10">
                {filteredSupplements.map((supplement) => (
                    <div
                        key={supplement.id}
                        onClick={() => setSelectedSupplement(supplement)}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 w-52 mx-auto cursor-pointer"
                    >
                        <div className="relative flex justify-center">
                            <img
                                src={supplement.media}
                                alt={supplement.name}
                                className="rounded-t-2xl w-full h-40 object-cover"
                            />
                            <p
                                className={`bg-white font-semibold rounded-lg p-1 text-sm absolute top-4 right-4 ${
                                    supplement.isAvailable ? "text-green-500" : "text-red-500"
                                }`}
                            >
                                {supplement.isAvailable ? "Available" : "Booked"}
                            </p>
                        </div>
                        <div className="p-4">
                            <h5 className="text-xl font-semibold">{supplement.name}</h5>
                            <div className="flex items-center gap-2 mt-2 text-gray-500">
                                <HiOutlineLocationMarker className="text-[#ffa502]" size={20} />
                                <p>{supplement.supplierName}</p>
                            </div>
                            <p className="text-lg font-bold mt-2">{supplement.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSupplement && (
                <PopupCard product={selectedSupplement} onClose={() => setSelectedSupplement(null)} />
            )}
        </div>
    );
}