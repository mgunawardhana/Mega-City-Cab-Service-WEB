import { MdClose } from "react-icons/md";
            import { useState, useEffect } from "react";
            import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
            import "leaflet/dist/leaflet.css";
            import Bill from "./Bill.jsx";
            import L from 'leaflet';
            import { STRIPE_SERVICE } from "../services/routes/stripeService.js";
            import api from "../services/services.js";

            // Fix for default marker icon
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            const SecondModal = ({ setIsSecondModalOpen, userName }) => {
                const driverOptions = ["Mr. Nilan", "Mr. Nelson", "Mr. Renuka", "Mr. Ravi", "Mr. Roshan"];
                const [driverId, setDriverId] = useState(driverOptions[0]);
                const [pickupLocation, setPickupLocation] = useState("");
                const [dropOffLocation, setDropOffLocation] = useState("");
                const [pickupCoords, setPickupCoords] = useState("");
                const [dropOffCoords, setDropOffCoords] = useState("");
                const [position, setPosition] = useState([6.9271, 79.8612]);
                const [distance, setDistance] = useState(0);
                const [duration, setDuration] = useState(0);
                const [cost, setCost] = useState(0);
                const [tax, setTax] = useState(0);
                const [totalAmount, setTotalAmount] = useState(0);
                const [route, setRoute] = useState([]);
                const [suggestions, setSuggestions] = useState([]);
                const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
                const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
                const [showBillModal, setShowBillModal] = useState(false);
                const [isLoading, setIsLoading] = useState(false);
                const [error, setError] = useState(null);

                const costPerKm = 80;
                const taxRate = 0.10;

                const searchPlaces = async (query, isPickup) => {
                    if (!query.trim()) return;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                        );
                        const data = await response.json();
                        setSuggestions(data.slice(0, 5));
                        setShowPickupSuggestions(isPickup);
                        setShowDropoffSuggestions(!isPickup);
                    } catch (error) {
                        console.error("Error searching places:", error);
                        setError("Failed to search locations. Please try again.");
                    }
                };

                const handlePlaceSelect = (place, isPickup) => {
                    const coords = `${place.lat}, ${place.lon}`;
                    if (isPickup) {
                        setPickupLocation(place.display_name);
                        setPickupCoords(coords);
                        setShowPickupSuggestions(false);
                    } else {
                        setDropOffLocation(place.display_name);
                        setDropOffCoords(coords);
                        setShowDropoffSuggestions(false);
                    }

                    if (pickupCoords && !isPickup) {
                        fetchRouteData(pickupCoords, coords);
                    }
                };

                useEffect(() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const { latitude, longitude } = position.coords;
                            setPosition([latitude, longitude]);
                            setPickupCoords(`${latitude}, ${longitude}`);

                            try {
                                const response = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                                );
                                const data = await response.json();
                                setPickupLocation(data.display_name);
                            } catch (error) {
                                console.error("Error getting address:", error);
                                setError("Failed to get current location. Please enter manually.");
                            }
                        });
                    }
                }, []);

                const fetchRouteData = async (pickup, drop) => {
                    const apiKey = "5b3ce3597851110001cf6248681c73ec5f3a8fc6c14bfacbc00708517be0a9d1dd8bf31c57b7624d"; // Replace with your API key
                    const [pickupLat, pickupLng] = pickup.split(", ").map(Number);
                    const [dropLat, dropLng] = drop.split(", ").map(Number);

                    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupLng},${pickupLat}&end=${dropLng},${dropLat}`;

                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        setRoute(routeCoords);

                        const distanceInKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(2);
                        const durationInMin = Math.round(data.features[0].properties.segments[0].duration / 60);

                        setDistance(distanceInKm);
                        setDuration(durationInMin);
                        updateCostAndTax(distanceInKm);
                    } catch (error) {
                        console.error("Error fetching route data:", error);
                        setError("Failed to calculate route. Please try again.");
                    }
                };

                const updateCostAndTax = (km) => {
                    const totalCost = km * costPerKm;
                    const taxAmount = totalCost * taxRate;
                    const finalAmount = totalCost + taxAmount;

                    setCost(totalCost.toFixed(2));
                    setTax(taxAmount.toFixed(2));
                    setTotalAmount(finalAmount.toFixed(2)); // Always ensure two decimal places
                };

                const LocationMarker = () => {
                    useMapEvents({
                        click(e) {
                            const coords = `${e.latlng.lat}, ${e.latlng.lng}`;
                            setDropOffCoords(coords);

                            fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
                            )
                                .then(response => response.json())
                                .then(data => {
                                    setDropOffLocation(data.display_name);
                                    if (pickupCoords) {
                                        fetchRouteData(pickupCoords, coords);
                                    }
                                })
                                .catch(error => {
                                    console.error("Error getting address:", error);
                                    setError("Failed to get location. Please try again.");
                                });
                        }
                    });
                    return <Marker position={position} />;
                };

                const handleSubmit = async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    let username = localStorage.getItem("user_name");
                    console.log(username);

                    try {
                        const response = await api.post(STRIPE_SERVICE, {
                            amount: Math.round(parseFloat(totalAmount) * 100),
                            quantity: 1,
                            name: username,
                            currency: 'LKR',
                        });

                        if (response.data.status === "SUCCESS" && response.data.sessionUrl) {
                            localStorage.setItem("if_pdf_need", true);
                            window.location.href = response.data.sessionUrl;
                        } else {
                            localStorage.setItem("if_pdf_need", false);
                            setError('Payment session creation failed. Please try again.');
                        }
                    } catch (error) {
                        localStorage.setItem("if_pdf_need", false);
                        console.error("Error creating payment session:", error);
                        setError('Error creating payment session. Please try again.');
                    } finally {
                        setIsLoading(false);
                    }
                };


                const handleClose = () => {
                    setIsSecondModalOpen(false);
                };

                const bookingData = {
                    driver: driverId,
                    pickup: pickupLocation,
                    dropoff: dropOffLocation,
                    distance: distance,
                    duration: duration,
                    cost: cost,
                    tax: tax,
                    totalAmount: totalAmount
                };

                if (showBillModal) {
                    return (
                        <Bill
                            userName={userName}
                            bookingData={bookingData}
                            onClose={() => {
                                setShowBillModal(false);
                                setIsSecondModalOpen(false);
                            }}
                        />
                    );
                }

                return (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-[600px] rounded-lg shadow-lg p-8 relative max-h-[90vh] overflow-y-auto">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                onClick={handleClose}
                            >
                                <MdClose size={24} />
                            </button>
                            <h2 className="text-center text-2xl font-bold mb-4 text-[#222]">Drop Booking</h2>
                            <p className="text-center text-sm mb-4">Fill the form and our vehicle will arrive</p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker />
                                {route.length > 0 && <Polyline positions={route} color="blue" />}
                            </MapContainer>

                            <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                                <div className="flex flex-col items-start relative">
                                    <label className="text-sm font-medium text-gray-700">Pickup Location *</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={pickupLocation}
                                        onChange={(e) => {
                                            setPickupLocation(e.target.value);
                                            searchPlaces(e.target.value, true);
                                        }}
                                        placeholder="Enter pickup location"
                                        required
                                    />
                                    {showPickupSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border rounded-b shadow-lg z-10">
                                            {suggestions.map((place, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handlePlaceSelect(place, true)}
                                                >
                                                    {place.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-start relative">
                                    <label className="text-sm font-medium text-gray-700">Drop-off Location *</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={dropOffLocation}
                                        onChange={(e) => {
                                            setDropOffLocation(e.target.value);
                                            searchPlaces(e.target.value, false);
                                        }}
                                        placeholder="Enter drop-off location or click on map"
                                        required
                                    />
                                    {showDropoffSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border rounded-b shadow-lg z-10">
                                            {suggestions.map((place, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handlePlaceSelect(place, false)}
                                                >
                                                    {place.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Driver *</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={driverId}
                                        onChange={(e) => setDriverId(e.target.value)}
                                        required
                                    >
                                        {driverOptions.map((driver, index) => (
                                            <option key={index} value={driver}>{driver}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Distance</label>
                                    <input
                                        className="w-full p-2 border rounded text-blue-500 font-bold"
                                        value={distance ? `${distance} km` : "N/A"}
                                        readOnly
                                    />
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Estimated Time</label>
                                    <input
                                        className="w-full p-2 border rounded text-green-500 font-bold"
                                        value={duration ? `${duration} mins` : "N/A"}
                                        readOnly
                                    />
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Cost</label>
                                    <input
                                        className="w-full p-2 border rounded text-green-500 font-bold"
                                        value={cost ? `Rs. ${cost}` : "N/A"}
                                        readOnly
                                    />
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Tax (10%)</label>
                                    <input
                                        className="w-full p-2 border rounded text-red-500 font-bold"
                                        value={tax ? `Rs. ${tax}` : "N/A"}
                                        readOnly
                                    />
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                                    <input
                                        className="w-full p-2 border rounded text-purple-500 font-bold"
                                        value={totalAmount ? `Rs. ${totalAmount}` : "N/A"}
                                        readOnly
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="col-span-2 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                                    disabled={!pickupLocation || !dropOffLocation}
                                >
                                    Place Booking
                                </button>
                            </form>
                        </div>
                    </div>
                );
            };

            export default SecondModal;