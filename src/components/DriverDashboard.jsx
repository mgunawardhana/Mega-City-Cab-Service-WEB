import React, { useEffect, useState } from 'react';
import api from "../services/services.js";
import { BOOKING_STATUS_CHANGE, DRIVER_FILTER, FETCH_ID_BY_EMAIL } from "../services/routes/loadAllDrivers.js";

function DriverDashboard() {
    const [driverStatus, setDriverStatus] = useState(() => localStorage.getItem('driverStatus') || 'AVAILABLE');
    const [bookingStatus, setBookingStatus] = useState('PENDING');
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [formValues, setFormValues] = useState(() => ({
        pickupLocation: localStorage.getItem('pickupLocation') || '',
        dropOffLocation: localStorage.getItem('dropOffLocation') || '',
        user_name: localStorage.getItem('user_name') || 'John Doe',
    }));
    const [selectedBookingNumber, setSelectedBookingNumber] = useState(null);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const styles = {
        driverStatus: {
            'AVAILABLE': 'bg-green-100 text-green-800 border-green-300',
            'BUSY': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'OFFLINE': 'bg-red-100 text-red-800 border-red-300'
        },
        bookingStatus: {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'ACCEPTED': 'bg-blue-100 text-blue-800 border-blue-300',
            'CLOSED': 'bg-gray-100 text-gray-800 border-gray-300'
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            try {
                await getRandomUser();
                const bookingNumber = await fetchDriverIdByEmail();
                if (bookingNumber) {
                    await fetchBookings(bookingNumber); // Pass the booking number directly
                }
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleDriverStatusChange = (e) => {
        const newStatus = e.target.value;
        setDriverStatus(newStatus);
        localStorage.setItem('driverStatus', newStatus);
    };

    const handleBookingStatusChange = (e) => {
        setBookingStatus(e.target.value);
    };

    const handleTermsChange = (e) => {
        setIsTermsAccepted(e.target.checked);
    };

    const handleLogStatus = async () => {
        const driverData = {
            driverEmail: localStorage.getItem('email_key') || 'Unknown Email',
            driverStatus,
            timestamp: new Date().toLocaleString()
        };
        console.log('Driver Status Update:', driverData);
    };

    const handleNotificationClick = (notification) => {
        const booking = notification.bookingData;
        setFormValues(prev => ({
            ...prev,
            pickupLocation: booking.pickupLocation,
            dropOffLocation: booking.dropOffLocation
        }));
        setSelectedBookingNumber(booking.bookingNumber);
        localStorage.setItem('pickupLocation', booking.pickupLocation);
        localStorage.setItem('dropOffLocation', booking.dropOffLocation);
    };

    const fetchDriverIdByEmail = async () => {
        try {
            const email = localStorage.getItem('email_key');
            if (!email) throw new Error('No email found in localStorage');

            const response = await api.post(`${FETCH_ID_BY_EMAIL}${email}`);
            const bookingNumber = response.data.result;
            setSelectedBookingNumber(bookingNumber);
            return bookingNumber;
        } catch (e) {
            console.error('Error fetching driver ID:', e);
            return null;
        }
    };

    const fetchBookings = async (bookingNum) => {
        console.log("selectedBookingNumber", bookingNum);

        if (!bookingNum) {
            console.log("No booking number available yet");
            return;
        }

        try {
            const response = await api.post(`${DRIVER_FILTER}${bookingNum}`);
            const bookings = response.data.result || [];

            // Filter only active bookings (not CLOSED)
            const activeBookings = bookings.filter(booking => booking.status !== "CLOSED");

            const formattedNotifications = activeBookings.map((booking) => ({
                id: booking.bookingNumber,
                name: `Booking #${booking.bookingNumber}`,
                action: `from ${booking.pickupLocation} to ${booking.dropOffLocation}`,
                time: new Date(booking.bookingDate).toLocaleString(),
                bookingData: booking
            }));

            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setNotifications([]);
        }
    };

    const handleBookingAction = async (status) => {
        if (!selectedBookingNumber) {
            console.error('No booking number selected');
            return;
        }

        const formData = {
            pickupLocation: formValues.pickupLocation,
            dropOffLocation: formValues.dropOffLocation,
            service: "Mega City Cab Service Colombo Branch",
            when: new Date().toLocaleString(),
            customer: formValues.user_name,
            bookingStatus: status,
            bookingNumber: selectedBookingNumber,
            timestamp: new Date().toLocaleString()
        };

        try {
            setBookingStatus(status);
            console.log("status", status);
            console.log("selectedBookingNumber", selectedBookingNumber);

            const response = await api.post(`${BOOKING_STATUS_CHANGE}${status}/${selectedBookingNumber}`);
            console.log('Booking update response:', response.data);

            if (status === "CLOSED") {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notif => notif.id !== selectedBookingNumber)
                );
            } else if (status === "ACCEPTED") {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notif =>
                        notif.id === selectedBookingNumber
                            ? { ...notif, bookingData: { ...notif.bookingData, status: "ACCEPTED" } }
                            : notif
                    )
                );
            }

            if (status === "CLOSED") {
                setFormValues({
                    pickupLocation: '',
                    dropOffLocation: '',
                    user_name: localStorage.getItem('user_name') || 'John Doe',
                });
                setSelectedBookingNumber(null);
                setIsTermsAccepted(false);
            }
        } catch (e) {
            console.error('Error updating booking:', e);
        }
    };

    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (i < retries - 1) {
                    console.warn(`Attempt ${i + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    };

    const getRandomUser = async () => {
        try {
            const data = await fetchWithRetry('https://randomuser.me/api', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const pictureUrl = data.results[0].picture.large;
            setProfilePicUrl(pictureUrl);
            return pictureUrl;
        } catch (error) {
            console.error('Error fetching random user:', error);
            setProfilePicUrl('https://via.placeholder.com/150?text=Profile+Image');
            return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col w-[1000px] gap-4">
                <div className="w-[1000px] bg-white p-4 rounded-t-xl shadow-2xl mb-[-10px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-base text-gray-700">
                                Driver: {localStorage.getItem('email_key') || 'Loading...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-base text-gray-700">Driver Status:</span>
                            <select
                                value={driverStatus}
                                onChange={handleDriverStatusChange}
                                className={`p-2 rounded-lg border ${styles.driverStatus[driverStatus]} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="BUSY">Busy</option>
                                <option value="OFFLINE">Offline</option>
                            </select>
                            <button
                                onClick={handleLogStatus}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    <div className="w-1/2 bg-white rounded-l-xl rounded-tl-none shadow-2xl ">
                        <div className="bg-amber-500 p-2 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Notifications</h2>
                            <button className="text-white hover:text-gray-200">
                                <span className="text-xl">⚙️</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-amber-600">
                                            <span className="text-sm font-bold">🚕</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800">
                                                <span className="font-semibold">{notification.name}</span> {notification.action}
                                            </p>
                                            <p className="text-gray-500 text-xs">{notification.time}</p>
                                        </div>
                                        <span className="text-green-500 text-xs">🟢</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No bookings available</p>
                            )}
                        </div>
                        <div className="p-2 text-center text-green-500 text-sm cursor-pointer hover:text-green-600">
                            See all recent activity
                        </div>
                    </div>

                    <div className="w-1/2 bg-white p-4 rounded-r-xl shadow-2xl text-sm">
                        <h2 className="text-xl font-bold mb-2 text-center text-gray-800 drop-shadow-md">
                            Please check and confirm
                        </h2>
                        <div className="grid gap-2 mb-4">
                            <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <span className="font-semibold text-sm text-gray-700">Pickup From</span>
                                <p className="text-base text-gray-900">{formValues.pickupLocation || 'Not selected'}</p>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <span className="font-semibold text-sm text-gray-700">Drop Off to</span>
                                <p className="text-base text-gray-900">{formValues.dropOffLocation || 'Not selected'}</p>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <span className="font-semibold text-sm text-gray-700">Service</span>
                                <p className="text-base text-gray-900">Mega City Cab Service Colombo Branch</p>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <span className="font-semibold text-sm text-gray-700">When</span>
                                <p className="text-base text-gray-900">{new Date().toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col gap-1 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <span className="font-semibold text-sm text-gray-700">Booking Status:</span>
                                <select
                                    value={bookingStatus}
                                    onChange={handleBookingStatusChange}
                                    className={`p-1 rounded-lg border ${styles.bookingStatus[bookingStatus]} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg shadow-inner">
                            <span className="font-semibold text-sm text-gray-700">Customer</span>
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
                                    alt="Random Profile"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-amber-500 shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
                            )}
                            <p className="text-lg font-bold text-gray-900">{formValues.user_name}</p>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg shadow-inner">
                                <input
                                    type="checkbox"
                                    checked={isTermsAccepted}
                                    onChange={handleTermsChange}
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 transition duration-200"
                                />
                                <span className="text-sm text-gray-800 font-medium">
                                    I agree to the terms and conditions and accept the assigned booking
                                </span>
                            </label>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => handleBookingAction('ACCEPTED')}
                                disabled={!isTermsAccepted || !selectedBookingNumber}
                                className={`px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 shadow-md ${(!isTermsAccepted || !selectedBookingNumber) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                ACCEPTED
                            </button>
                            <button
                                onClick={() => handleBookingAction('CLOSED')}
                                disabled={!selectedBookingNumber}
                                className={`px-3 py-1 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-md ${!selectedBookingNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                CLOSED
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DriverDashboard;