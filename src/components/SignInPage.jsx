import { useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/services.js";
import { LOGIN } from "../services/routes/login.js";

export default function SignInPage() {
    const [email, setEmail] = useState("maneesha@gmail.com");
    const [password, setPassword] = useState("maneesha@123");
    const navigate = useNavigate();

    localStorage.setItem('email_key',email);

    const Login = async () => {
        try {
            const response = await api.post(LOGIN, { email, password });
            console.log("Response:", response.data);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem("user_name", response.data.user_name);
            localStorage.setItem("role", response.data.role); // Store the role
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Login().then((data) => {
            // Navigate based on role
            if (data.role === "DRIVER") {
                navigate("/driver-dashboard"); // New route for drivers
            } else if (data.role === "ADMIN") {
                navigate("/booking"); // Existing route for admin
            } else {
                navigate("/booking"); // Default route for other roles
            }
        }).catch((error) => {
            // Handle login error (e.g., show error message)
            console.error("Login failed:", error);
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white w-[400px] rounded-lg shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-[#222]">Sign In</h2>
                <p className="text-center text-sm mb-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#ffa502] underline hover:text-[#e69500]">
                        Sign up
                    </a>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#555]">
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#555]">
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
                    <button
                        type="submit"
                        className="w-full bg-[#ffa502] text-white py-3 rounded font-bold hover:bg-[#e69500] transition"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-center text-sm my-4">Or continue with</div>
                <div className="flex justify-center gap-4">
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <FaFacebookF className="text-blue-600" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <FaTwitter className="text-blue-400" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <FaGithub className="text-gray-800" />
                    </button>
                </div>
            </div>
        </div>
    );
}