import { MdClose } from "react-icons/md";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SecondModal = ({setIsSecondModalOpen }) => {


    const driverOptions = ["Driver 1", "Driver 2", "Driver 3", "Driver 4"];
    const [driverId, setDriverId] = useState(driverOptions[0]);
    const [destinationDetails, setDestinationDetails] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropOffLocation, setDropOffLocation] = useState("");
    const [taxes, setTaxes] = useState("+3.071");
    const [position, setPosition] = useState([51.505, -0.09]);
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setPickupLocation(`${latitude}, ${longitude}`);
                setPosition([latitude, longitude]);
            });
        }
    }, []);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setDropOffLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
                setDestinationDetails(`${e.latlng.lat}, ${e.latlng.lng}`);
            }
        });
        return position === null ? null : <Marker position={position} />;
    };

    const openSecondModal = () => {

    };


    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Form submitted successfully!");
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
                <h2 className="text-center text-2xl font-bolder mb-4 text-[#222]">Drop Booking</h2>
                <p className="text-center text-sm">Fill an wait Our Vehicle will caught you</p>

                <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
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
                        <label className="text-left text-sm font-medium text-gray-700">Taxes</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded text-red-500 font-bold"
                            value={taxes}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700">Booking Date</label>
                        <input type="date" className="w-full p-2 border rounded" value={today} readOnly required />
                    </div>
                    <div className="flex flex-col items-start">
                        <label className="text-left text-sm font-medium text-gray-700">Driver ID</label>
                        <select className="w-full p-2 border rounded" value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
                            {driverOptions.map((driver, index) => (
                                <option key={index} value={driver}>{driver}</option>
                            ))}
                        </select>
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
