import React, {useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Bill({ onClose,bookingData }) {

    console.log("sample data",bookingData)

    const billRef = useRef(null);

    useEffect(() => {
        handleDownloadPDF();
    }, []);

    const handleDownloadPDF = () => {
        const input = billRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("mega-city-cab-service.pdf");
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div ref={billRef} className="relative max-w-4xl mx-auto p-8 bg-white border border-gray-300 shadow-lg">
                <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    ✖
                </button>

                <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">MEGA CITY CAB SERVICE</h1>

                    </div>
                    <h2 className="text-4xl font-bold text-orange-500">INVOICE</h2>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                        <p><strong>Contact: </strong> (+94) ( 011) 2683171</p>
                        <p><strong>Address: </strong>137 1/1 Cotta Road, Colombo 08</p>
                        <p><strong>Mail: </strong>info@megacitycabservicepro.com</p>
                    </div>
                    <div>

                        <p><strong>Name:</strong></p>
                        <p><strong>Invoice #:</strong> {`INV${new Date().toISOString().replace(/[-:.TZ]/g, "")}`}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>

                <table className="w-full mt-6 border border-gray-800">
                    <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-800 px-4 py-2">DESCRIPTION</th>
                        <th className="border border-gray-800 px-4 py-2">DISTANCE</th>
                        <th className="border border-gray-800 px-4 py-2">TIME</th>
                        <th className="border border-gray-800 px-4 py-2">TOTAL</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b border-gray-300">
                        <td className="border px-4 py-2">your pickup location is {bookingData.pickup} and drop off location is {bookingData.dropoff}</td>
                        <td className="border px-4 py-2">{bookingData.distance} km</td>
                        <td className="border px-4 py-2">{bookingData.duration} min</td>
                        <td className="border px-4 py-2">{bookingData.cost}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <div className="w-1/3 space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span>SUB TOTAL</span>
                            <span>{bookingData.cost}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>TAX</span>
                            <span>{bookingData.tax}</span>
                        </div>
                        <div className="flex justify-between font-bold text-orange-500">
                            <span>GRAND TOTAL</span>
                            <span>{bookingData.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <p className="text-sm">
                        TERMS: Payments must be made in full upon trip completion via cash, card, or digital payment methods. Any disputes regarding fare must be raised immediately.
                    </p>
                </div>

                <div className="text-center mt-8 text-gray-700">
                    <h2 className="text-xl font-bold">Thank you for choosing Mega City cab Service! We appreciate your trust and look forward to serving you again. Safe travels.!</h2>
                    {/*<p>Contact us at: 123-456-7890</p>*/}
                    <div className="flex justify-center space-x-4 mt-2">
                        <span>© 2025 Mega City Cab Service</span>
                        <span>@MegaCityCab</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
