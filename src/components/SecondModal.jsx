import { MdClose } from "react-icons/md";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SecondModal = ({ setIsSecondModalOpen }) => {
    const driverOptions = ["Driver 1", "Driver 2", "Driver 3", "Driver 4"];
    const [driverId, setDriverId] = useState(driverOptions[0]);
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropOffLocation, setDropOffLocation] = useState("");
    const [position, setPosition] = useState([6.9271, 79.8612]); // Default to Colombo, Sri Lanka
    const [distance, setDistance] = useState(0);
    const [cost, setCost] = useState(0);
    const [tax, setTax] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const today = new Date().toISOString().split("T")[0];

    const costPerKm = 80; // Rs. 80 per km
    const taxRate = 0.10; // 10% tax

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setPickupLocation(`${latitude}, ${longitude}`);
                setPosition([latitude, longitude]);
            });
        }
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); // Distance in km
    };

    const updateCostAndTax = (km) => {
        const totalCost = km * costPerKm;
        const taxAmount = totalCost * taxRate;
        const finalAmount = totalCost + taxAmount;

        setCost(totalCost.toFixed(2));
        setTax(taxAmount.toFixed(2));
        setTotalAmount(finalAmount.toFixed(2));
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setDropOffLocation(`${e.latlng.lat}, ${e.latlng.lng}`);

                if (pickupLocation) {
                    const [pickupLat, pickupLng] = pickupLocation.split(", ").map(Number);
                    const dropLat = e.latlng.lat;
                    const dropLng = e.latlng.lng;
                    const calculatedDistance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
                    setDistance(calculatedDistance);
                    updateCostAndTax(calculatedDistance);
                }
            }
        });
        return position === null ? null : <Marker position={position} />;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Booking Confirmed! Distance: ${distance} km, Amount: Rs. ${totalAmount}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[600px] rounded-lg shadow-lg p-8 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={() => setIsSecondModalOpen()}
                >
                    <MdClose size={24} />
                </button>
                <h2 className="text-center text-2xl font-bold mb-4 text-[#222]">Drop Booking</h2>
                <p className="text-center text-sm">Fill the form and our vehicle will arrive</p>

                <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>

                <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                    {[
                        { label: "Pickup Location", value: pickupLocation, onChange: setPickupLocation },
                        { label: "Drop-off Location", value: dropOffLocation, onChange: setDropOffLocation },
                        { label: "Car Number", type: "text", pattern: "[A-Za-z0-9]+" },
                        { label: "Telephone Number", type: "tel", pattern: "[0-9]{10}" },
                        { label: "NIC", type: "text", pattern: "[A-Za-z0-9]+" },
                    ].map(({ label, value, onChange, ...props }, index) => (
                        <div key={index} className="flex flex-col items-start">
                            <label className="text-left text-sm font-medium text-gray-700">
                                {label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full p-2 border rounded"
                                value={value}
                                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                                {...props}
                                required
                            />
                        </div>
                    ))}

                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700 mb-1">Driver <span
                            className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">Assigned by AI</span></label>
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
                        <label className="text-left text-sm font-medium text-gray-700">Distance </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-blue-500 font-bold"
                            value={distance ? `${distance} km` : "Select drop-off location"}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700">Cost (Rs.)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-green-500 font-bold"
                            value={distance ? `Rs. ${cost}` : "N/A"}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700 mb-1">Tax (10%) <span
                            className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">Tax rate updated</span>


                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-red-500 font-bold"
                            value={tax ? `Rs. ${tax}` : "N/A"}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700">Your Total Amount</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-purple-500 font-bold"
                            value={totalAmount ? `Rs. ${totalAmount}` : "N/A"}
                            readOnly
                        />
                    </div>

                    <button type="submit" className="col-span-2 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
                        Place Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SecondModal;
