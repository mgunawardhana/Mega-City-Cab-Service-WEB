import { useState } from "react";
import { MdClose } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function NavBar() {
    const [dropdown, setDropdown] = useState(false);
    const showDropdown = () => setDropdown(!dropdown);

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
                            <Link
                                key={index}
                                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} // Adjust paths as needed
                                className="leading-normal no-underline text-black text-lg hover:text-[#ffa502]"
                            >
                                {item}
                            </Link>
                        ))}
                    </ul>

                    <div className="flex gap-4 max-lg:hidden">
                        <Link
                            to="/signin"
                            className="bg-transparent rounded shadow h-10 px-6 outline-none text-black hover:bg-[#ffa502] hover:text-white cursor-pointer text-base transition-bg hover:border hover:border-primary flex items-center justify-center"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-[#ffa502] rounded shadow h-10 px-6 outline-none text-white hover:bg-white hover:text-[#ffa502] cursor-pointer text-base transition-bg hover:border hover:border-primary flex items-center justify-center"
                        >
                            Sign Up
                        </Link>
                    </div>


                    {dropdown ? (
                        <MdClose
                            onClick={showDropdown}
                            className="lg:hidden text-[22px] cursor-pointer text-black"
                        />
                    ) : (
                        <HiMenuAlt3
                            onClick={showDropdown}
                            className="lg:hidden text-[22px] cursor-pointer text-black"
                        />
                    )}
                </div>

                {dropdown && (
                    <div className="lg:hidden w-11/12 mx-auto flex flex-col items-center gap-4 mt-4">
                        {["Home", "Ticket", "Explore", "Activity"].map((item, index) => (
                            <Link
                                key={index}
                                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                className="text-black text-lg hover:text-[#ffa502]"
                                onClick={() => setDropdown(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            to="/signin"
                            className="text-black text-lg hover:text-[#ffa502]"
                            onClick={() => setDropdown(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-black text-lg hover:text-[#ffa502]"
                            onClick={() => setDropdown(false)}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}