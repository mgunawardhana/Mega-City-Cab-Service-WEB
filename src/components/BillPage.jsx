import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

export default function BillPage() {
    const billRef = useRef(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null);
    const navigate = useNavigate();
    const [hasGeneratedPDF, setHasGeneratedPDF] = useState(false); // New state to prevent duplicates

    // Retrieve booking data and username from localStorage
    const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {
        driver: "N/A",
        pickup: "N/A",
        dropoff: "N/A",
        distance: "0",
        duration: "0",
        cost: "0.00",
        tax: "0.00",
        totalAmount: "0.00",
    };
    const userName = localStorage.getItem("userName") || "Guest";

    useEffect(() => {
        const shouldGeneratePDF = localStorage.getItem("if_pdf_need") === "true" && !hasGeneratedPDF;
        if (shouldGeneratePDF) {
            handleDownloadPDF();
            setHasGeneratedPDF(true); // Mark as generated to prevent re-running
        }
    }, [hasGeneratedPDF]); // Depend on hasGeneratedPDF to avoid re-running unnecessarily

    const handleDownloadPDF = async () => {
        if (sendingEmail) return;
        setSendingEmail(true);
        setEmailStatus(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 100));

            const input = billRef.current;
            if (!input) {
                throw new Error("Bill reference not found");
            }

            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: input.scrollWidth,
                windowHeight: input.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice-${new Date().toISOString().replace(/[-:.TZ]/g, "")}.pdf`);

            const invoiceNumber = `INV${new Date().toISOString().replace(/[-:.TZ]/g, "")}`;
            const emailData = {
                to_email: "maneesha.gunawardhana.contact@gmail.com",
                userName: userName,
                invoice_no: invoiceNumber,
                pickup: bookingData.pickup,
                dropoff: bookingData.dropoff,
                total_amount: bookingData.totalAmount,
            };

            emailjs.init("ejR0xzMGaWtvCmdBw");
            const response = await emailjs.send(
                "service_o4z3qa5",
                "template_u9wcogp",
                emailData
            );

            if (response.status === 200) {
                setEmailStatus("success");
                console.log("Email sent successfully!", response);
                setTimeout(() => {
                    navigate("/"); // Redirect to http://localhost:5173/
                }, 1000); // Brief delay to show success message
            } else {
                throw new Error("Email sending failed");
            }
        } catch (error) {
            console.error("Error in PDF generation or email sending:", error);
            setEmailStatus("error");
        } finally {
            setSendingEmail(false);
            // Clear localStorage after PDF generation and email attempt
            localStorage.removeItem("if_pdf_need");
            localStorage.removeItem("bookingData");
            localStorage.removeItem("userName");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            <div className="relative max-w-4xl mx-auto">
                {emailStatus && (
                    <div
                        className={`absolute -top-12 left-0 right-0 text-center p-2 rounded ${
                            emailStatus === "success" ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                    >
                        {emailStatus === "success"
                            ? "Invoice sent successfully!"
                            : "Failed to send invoice. Please try again."}
                    </div>
                )}

                <div ref={billRef} className="p-8 bg-white border border-gray-300 shadow-lg">
                    <button
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                        onClick={() => navigate("/")}
                    >
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
                            <p>
                                <strong>Contact: </strong> (+94) (011) 2683171
                            </p>
                            <p>
                                <strong>Address: </strong> 137 1/1 Cotta Road, Colombo 08
                            </p>
                            <p>
                                <strong>Mail: </strong> info@megacitycabservicepro.com
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {userName}
                            </p>
                            <p>
                                <strong>Invoice #:</strong>{" "}
                                {`INV${new Date().toISOString().replace(/[-:.TZ]/g, "")}`}
                            </p>
                            <p>
                                <strong>Date:</strong> {new Date().toLocaleDateString()}{" "}
                                {new Date().toLocaleTimeString()}
                            </p>
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
                            <td className="border px-4 py-2">
                                Your pickup location is {bookingData.pickup} and drop-off location is{" "}
                                {bookingData.dropoff}
                            </td>
                            <td className="border px-4 py-2">{bookingData.distance} km</td>
                            <td className="border px-4 py-2">{bookingData.duration} min</td>
                            <td className="border px-4 py-2">Rs. {bookingData.cost}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-6">
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between border-b pb-2">
                                <span>SUB TOTAL</span>
                                <span>Rs. {bookingData.cost}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>TAX</span>
                                <span>Rs. {bookingData.tax}</span>
                            </div>
                            <div className="flex justify-between font-bold text-orange-500">
                                <span>GRAND TOTAL</span>
                                <span>Rs. {bookingData.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <p className="text-sm">
                            TERMS: Payments must be made in full upon trip completion via cash, card, or
                            digital payment methods. Any disputes regarding fare must be raised
                            immediately.
                        </p>
                    </div>

                    <div className="text-center mt-8 text-gray-700">
                        <h2 className="text-xl font-bold">
                            Thank you for choosing Mega City Cab Service! We appreciate your trust and
                            look forward to serving you again. Safe travels!
                        </h2>
                        <div className="flex justify-center space-x-4 mt-2">
                            <span>© 2025 Mega City Cab Service</span>
                            <span>@MegaCityCab</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}