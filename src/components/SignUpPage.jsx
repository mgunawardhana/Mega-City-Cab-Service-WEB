import { useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/services.js";
import { SIGN_UP } from "../services/routes/signup.js";

export default function SignUpPage() {
    const [role] = useState("CUSTOMER");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [nic, setNic] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [mobile, setMobile] = useState("");
    const navigate = useNavigate();

    const SignUp = async () => {
        try {
            const response = await api.post(SIGN_UP, {
                role,
                firstName,
                lastName,
                address,
                confirmPassword,
                dateOfBirth,
                email,
                mobile,
                nic,
                password,
            });
            console.log("Response:", response.data);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("user_name", response.data.user_name);
            return response.data;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        SignUp().then(() => {
            navigate("/login");
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div
                className="bg-white w-[600px] rounded-lg p-6 shadow-[rgba(50,50,93,0.25)_0px_50px_100px_-20px,rgba(0,0,0,0.3)_0px_30px_60px_-30px,rgba(10,37,64,0.35)_0px_-2px_6px_0px_inset] border border-gray-300"
            >
                <h2 className="text-center text-2xl font-bold mb-4 text-black">Sign Up</h2>
                <p className="text-center text-sm mb-4 text-gray-500">
                    Already have an account?{" "}
                    <a href="/signin" className="text-[#ffa502] underline hover:text-[#e69500]">
                        Sign in
                    </a>
                </p>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="role" value="customer" />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your last name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Password *
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Address *
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your address"
                                required
                            />
                        </div>

                        <div >
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                NIC *
                            </label>
                            <input
                                type="text"
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your NIC"
                                required
                            />
                        </div>
                        <div >
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Date of Birth *
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Mobile *
                            </label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                placeholder="Enter your mobile number"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#ffa502] text-white py-3 rounded font-bold hover:bg-[#e69500] transition box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;"
                    >
                        Sign Up
                    </button>
                </form>
                {/*<div className="text-center text-sm my-4 text-gray-500">Or continue with</div>*/}
                <div className="flex justify-center gap-4">
                    {/*<button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">*/}
                    {/*    <FaFacebookF className="text-blue-600" />*/}
                    {/*</button>*/}
                    {/*<button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">*/}
                    {/*    <FaTwitter className="text-blue-400" />*/}
                    {/*</button>*/}
                    {/*<button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">*/}
                    {/*    <FaGithub className="text-gray-800" />*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );
}