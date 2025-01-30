import { useState } from "react";
import { MdClose } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import SecondModal from "./SecondModal.jsx";

export default function NavBar() {
    const [dropdown, setDropdown] = useState(false);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showDropdown = () => setDropdown(!dropdown);



    const openSignInModal = () => {
        setIsNavigationOpen(false);
        setIsSignInModalOpen(true);
        setIsSecondModalOpen(false);
    };

    const closeSignInModal = () => setIsSignInModalOpen(false);

    const openSecondModal = () => {
        setIsSignInModalOpen(false);
        setIsSecondModalOpen(true);
    };

    const closeSecondModal = () => setIsSecondModalOpen(false);

    return (
        <nav className="w-full h-24 flex flex-col justify-center items-center sticky top-0 z-50 bg-white">
            <div className="container mx-auto lg:px-3 w-full">
                <div className="lg:w-full w-11/12 mx-auto h-full flex justify-between items-center">
                    <div className="flex items-center gap-x-2">
                        <h1 className="text-[#ffa502] font-bold text-3xl">
                            Mega City Cab Service
                        </h1>
                    </div>

                    <ul className="flex items-center xl:gap-12 gap-x-4 max-lg:hidden">
                        {["Home", "Ticket", "Explore", "Activity"].map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                className="leading-normal no-underline text-black text-lg hover:text-[#ffa502]"
                            >
                                {item}
                            </a>
                        ))}
                    </ul>

                    <div className="flex gap-4 max-lg:hidden">
                        <button
                            onClick={openSignInModal}
                            className="bg-transparent rounded shadow h-12 px-6 outline-none text-black hover:bg-[#ffa502] hover:text-white cursor-pointer text-base transition-bg hover:border hover:border-primary"
                        >
                            Sign In
                        </button>
                        <button
                            className="bg-[#ffa502] rounded shadow h-12 px-6 outline-none text-white hover:bg-white hover:text-[#ffa502] cursor-pointer text-base transition-bg hover:border hover:border-primary"
                        >
                            Sign Up
                        </button>
                    </div>

                    {dropdown ? (
                        <MdClose onClick={showDropdown} className="lg:hidden text-[22px] cursor-pointer text-black" />
                    ) : (
                        <HiMenuAlt3 onClick={showDropdown} className="lg:hidden text-[22px] cursor-pointer text-black" />
                    )}
                </div>
            </div>

            {isSignInModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[400px] rounded-lg shadow-lg p-8 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            onClick={closeSignInModal}
                        >
                            <MdClose size={24}/>
                        </button>
                        <h2 className="text-center text-2xl font-bold mb-4 text-[#222]">Sign In</h2>
                        <p className="text-center text-sm mb-4">
                            Don't have an account?{" "}
                            <a href="#" className="text-[#ffa502] underline hover:text-[#e69500]">
                                Sign up
                            </a>
                        </p>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-[#555]">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                    placeholder="admin@fusetheme.com"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-[#555]">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ffa502]"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                onClick={openSecondModal}
                                className="w-full bg-[#ffa502] text-white py-3 rounded font-bold hover:bg-[#e69500] transition"
                            >
                                Sign In
                            </button>
                        </form>
                        <div className="text-center text-sm my-4">Or continue with</div>
                        <div className="flex justify-center gap-4">
                            <button
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                <FaFacebookF className="text-blue-600"/>
                            </button>
                            <button
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                <FaTwitter className="text-blue-400"/>
                            </button>
                            <button
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                                <FaGithub className="text-gray-800"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSecondModalOpen && (
                <SecondModal setIsSecondModalOpen={setIsSecondModalOpen}/>
            )}
        </nav>
    );
}
