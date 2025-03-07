import {useEffect, useState} from "react";
import {MapContainer, Marker, Polyline, TileLayer, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/services.js";
import {useNavigate} from "react-router-dom";
import {FETCH_ALL_DRIVERS} from "../services/routes/loadAllDrivers.js";
import {GET_SUPPLEMENT_ENDPOINT} from "../services/routes/supplementRoute.js";
import {FETCH_VEHICLES} from "../services/routes/loadVehicle.js";
import {GUIDE_LINE} from "../services/routes/guideLine.js";
import {PLACE_BOOKING, STRIPE_SERVICE} from "../services/routes/stripeService.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


const Popup = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    const [guidelines, setGuidelines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(GUIDE_LINE);
            console.log("guideline 00000000000", response.data.result);
            setGuidelines(response.data.result || []);
            setError(null);
        } catch (e) {
            console.error("Error fetching guideline data:", e.message);
            setError("Failed to load guidelines. Please try again.");
            setGuidelines([]);
        } finally {
            setLoading(false);
        }
    };


    const timelineEvents = guidelines.map((item) => ({
        icon: "📋",
        title: item.title, description: item.description, time: "2025-03-03 14:40:22",
        category: item.category, priority: item.priority, relatedTo: item.relatedTo || "Cab Service",
    }));

    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Guidelines & Notifications</h3>
                    <button
                        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-300"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>


                {loading ? (<p className="text-center text-gray-500">Loading guidelines...</p>) : error ? (
                    <p className="text-center text-red-500">{error}</p>) : (
                    <div className="relative">

                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>


                        {timelineEvents.length > 0 ? (timelineEvents.map((event, index) => (<div
                                    key={index}
                                    className="flex items-start mb-6 relative pl-10"
                                >

                                    <div
                                        className="absolute left-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-xl">
                                        {event.icon}
                                    </div>

                                    <div className="ml-2">
                                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {event.description} • {event.category} • Priority: {event.priority} •
                                            Related to: {event.relatedTo}
                                        </p>
                                        <p className="text-xs text-gray-400">{event.time}</p>
                                    </div>
                                </div>))) : (<p className="text-center text-gray-500">No guidelines available.</p>)}
                    </div>)}
            </div>
        </div>);
};

export default function BookingPage() {
    const [drivers, setDrivers] = useState([]);
    const [driverId, setDriverId] = useState("");
    const [isManualDriverSelection, setIsManualDriverSelection] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [vehicleType, setVehicleType] = useState("");
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup
    const navigate = useNavigate();

    // Vehicle type cost mapping
    const vehicleTypes = {
        "LUXURY": 150, "SEMI-LUXURY": 120, "ECONOMY": 80, "ELECTRONIC": 100, "SEDAN": 90
    };

    const taxRate = 0.10;

    useEffect(() => {
        fetchData();
        loadDrivers();
        loadVehicles();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get(GET_SUPPLEMENT_ENDPOINT);
            console.log("Fetched Supplement Data:", response.data.result);
        } catch (e) {
            console.error("Error fetching supplement data:", e.message);
        }
    };

    const loadDrivers = async () => {
        try {
            const response = await api.post(FETCH_ALL_DRIVERS);
            const driversOnly = response.data.result
                .filter(driver => driver.role === "DRIVER")
                .map(driver => ({
                    id: driver.id, name: `${driver.firstName} ${driver.lastName}`
                }));

            setDrivers(driversOnly);
            if (driversOnly.length > 0 && !isManualDriverSelection) {
                setDriverId(driversOnly[0].id);
            }
            console.log("Fetched Driver Details:", driversOnly);
        } catch (error) {
            console.error("Error fetching drivers:", error.message);
            setError("Failed to load drivers. Please try again.");
        }
    };

    const loadVehicles = async () => {
        try {
            console.log("Attempting to fetch vehicles from:", FETCH_VEHICLES);
            const response = await api.get(FETCH_VEHICLES);
            console.log("Raw vehicle response:", response);

            const vehicleData = Array.isArray(response.data) ? response.data : response.data.result || [];
            console.log("Processed vehicle data:", vehicleData);

            const availableVehicles = vehicleData
                .filter(vehicle => vehicle.status === "AVAILABLE")
                .map(vehicle => ({
                    id: vehicle.id,
                    registrationNumber: vehicle.registrationNumber,
                    vehicleType: vehicle.vehicleType.toUpperCase(),
                    displayName: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`
                }));

            setVehicles(availableVehicles);
            if (availableVehicles.length > 0) {
                setVehicleId(availableVehicles[0].id);
                setVehicleType(availableVehicles[0].vehicleType);
            }
            console.log("Fetched Available Vehicles:", availableVehicles);
        } catch (error) {
            console.error("Error fetching vehicles:", error.message);
            console.error("Error details:", error.response || error);
            setError("Failed to load vehicles. Please try again.");
        }
    };

    const handleManualSelectionChange = (e) => {
        const isChecked = e.target.checked;
        setIsManualDriverSelection(isChecked);
        if (!isChecked && drivers.length > 0) {
            setDriverId(drivers[0].id);
        }
    };

    const handleVehicleChange = (e) => {
        const selectedId = e.target.value;
        setVehicleId(selectedId);
        const selectedVehicle = vehicles.find(vehicle => vehicle.id === parseInt(selectedId));
        if (selectedVehicle) {
            setVehicleType(selectedVehicle.vehicleType);
        }
    };

    const searchPlaces = async (query, isPickup) => {
        if (!query.trim()) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSuggestions(data.slice(0, 5));
            setShowPickupSuggestions(isPickup);
            setShowDropoffSuggestions(!isPickup);
        } catch (error) {
            console.error("Error searching places:", error.message);
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
                const {latitude, longitude} = position.coords;
                setPosition([latitude, longitude]);
                setPickupCoords(`${latitude}, ${longitude}`);

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    setPickupLocation(data.display_name);
                } catch (error) {
                    console.error("Error getting address:", error.message);
                    setError("Failed to get current location. Please enter manually.");
                }
            });
        }
    }, []);

    const fetchRouteData = async (pickup, drop) => {
        const apiKey = "5b3ce3597851110001cf6248681c73ec5f3a8fc6c14bfacbc00708517be0a9d1dd8bf31c57b7624d";
        const [pickupLat, pickupLng] = pickup.split(", ").map(Number);
        const [dropLat, dropLng] = drop.split(", ").map(Number);

        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupLng},${pickupLat}&end=${dropLng},${dropLat}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const routeCoords = data.features[0].geometry.coordinates.map((coord) => [coord[1], coord[0],]);
            setRoute(routeCoords);

            const distanceInKm = (data.features[0].properties.segments[0].distance / 1000).toFixed(2);
            const durationInMin = Math.round(data.features[0].properties.segments[0].duration / 60);

            setDistance(distanceInKm);
            setDuration(durationInMin);
            updateCostAndTax(distanceInKm);
        } catch (error) {
            console.error("Error fetching route data:", error.message);
            setError("Failed to calculate route. Please try again.");
        }
    };

    const updateCostAndTax = (km) => {
        const costPerKm = vehicleTypes[vehicleType] || 80;
        const totalCost = km * costPerKm;
        const taxAmount = totalCost * taxRate;
        const finalAmount = totalCost + taxAmount;

        setCost(totalCost.toFixed(2));
        setTax(taxAmount.toFixed(2));
        setTotalAmount(finalAmount.toFixed(2));
    };

    useEffect(() => {
        if (distance) {
            updateCostAndTax(distance);
        }
    }, [vehicleType, distance]);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const coords = `${e.latlng.lat}, ${e.latlng.lng}`;
                setDropOffCoords(coords);

                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setDropOffLocation(data.display_name);
                        if (pickupCoords) {
                            fetchRouteData(pickupCoords, coords);
                        }
                    })
                    .catch((error) => {
                        console.error("Error getting address:", error.message);
                        setError("Failed to get location. Please try again.");
                    });
            },
        });
        return <Marker position={position}/>;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        let username = localStorage.getItem("user_name");

        localStorage.setItem("pickupLocation", pickupLocation);
        localStorage.setItem("dropOffLocation", dropOffLocation);

        const bookingDetails = {
            bookingDate: "2025-02-12T10:10:00",
            pickupLocation: pickupLocation,
            dropOffLocation: dropOffLocation,
            carNumber: vehicleId,
            taxes: parseFloat(tax),
            distance: parseFloat(distance),
            estimatedTime: duration,
            taxWithoutCost: parseFloat(cost),
            totalAmount: parseFloat(totalAmount),
            customerRegistrationNumber: username,
            driverId: driverId,
            status: "PENDING"
        };

        console.log("Booking data log:", bookingDetails);
        localStorage.setItem("bookingData", JSON.stringify(bookingDetails));
        localStorage.setItem("userName", username);

        try {
            // Step 1: Save the booking
            const savedResp = await api.post(PLACE_BOOKING, bookingDetails);

            console.log("savedResp", savedResp)

            // Step 2: Check if booking was successful, then trigger payment
            if (savedResp.status === 200) { // Adjust condition based on your API response
                const response = await api.post(STRIPE_SERVICE, {
                    amount: Math.round(parseFloat(totalAmount) * 100),
                    quantity: 1,
                    name: username,
                    currency: "LKR",
                });

                if (response.data.status === "SUCCESS" && response.data.sessionUrl) {
                    localStorage.setItem("if_pdf_need", "true");
                    window.location.href = response.data.sessionUrl;
                } else {
                    localStorage.setItem("if_pdf_need", "false");
                    setError("Payment session creation failed. Please try again.");
                }
            } else {
                setError("Booking creation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-[#222]">Drop Booking</h2>
                <div className="flex justify-center items-center mb-4">
                    <p className="text-center text-sm mr-4">Fill the form and our vehicle will arrive</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPopupOpen}
                            onChange={() => setIsPopupOpen(!isPopupOpen)}
                        />
                        <div
                            className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-amber-500 transition-colors">
                            <div
                                className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:translate-x-full transition-transform"></div>
                        </div>
                    </label>
                </div>

                {/* Popup Component */}
                <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}/>

                {error && (<div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>)}

                <MapContainer center={position} zoom={13}
                              style={{height: "300px", width: "100%", zIndex: 10}}> {/* Lower z-index for map */}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <LocationMarker/>
                    {route.length > 0 && <Polyline positions={route} color="blue"/>}
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
                                {suggestions.map((place, index) => (<div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handlePlaceSelect(place, true)}
                                    >
                                        {place.display_name}
                                    </div>))}
                            </div>)}
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
                                {suggestions.map((place, index) => (<div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handlePlaceSelect(place, false)}
                                    >
                                        {place.display_name}
                                    </div>))}
                            </div>)}
                    </div>

                    <div className="flex flex-col items-start">
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id="manualDriver"
                                checked={isManualDriverSelection}
                                onChange={handleManualSelectionChange}
                                className="mr-2"
                            />
                            <label htmlFor="manualDriver" className="text-sm font-medium text-gray-700">
                                Choose Driver Manually
                            </label>
                        </div>
                        <select
                            className="w-full p-2 border rounded"
                            value={driverId}
                            onChange={(e) => setDriverId(e.target.value)}
                            disabled={!isManualDriverSelection}
                            required
                        >
                            {drivers.length > 0 ? (drivers.map((driver) => (<option key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </option>))) : (<option value="">Loading drivers...</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-sm font-medium text-gray-700">Vehicle *</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={vehicleId}
                            onChange={handleVehicleChange}
                            required
                        >
                            {vehicles.length > 0 ? (vehicles.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.displayName} - {vehicle.vehicleType}
                                    </option>))) : (<option value="">Loading vehicles...</option>)}
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
                        disabled={!pickupLocation || !dropOffLocation || !driverId || !vehicleId || isLoading}
                    >
                        {isLoading ? "Processing..." : "Place Booking"}
                    </button>
                </form>
            </div>
        </div>);
}