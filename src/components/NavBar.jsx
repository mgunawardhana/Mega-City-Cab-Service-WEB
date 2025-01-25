import {useState} from "react";
import {MdClose} from "react-icons/md";
import {HiMenuAlt3} from "react-icons/hi";

export default function NavBar() {
    const [dropdown, setDropdown] = useState(false);

    const showDropdown = () => {
        setDropdown(!dropdown);
    }

    return (<nav className="w-full h-24 flex flex-col justify-center items-center sticky top-0 z-50 bg-white">
        <div className="container mx-auto lg:px-3 w-full">
            <div className="lg:w-full w-11/12 mx-auto h-full flex justify-between items-center">
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center gap-x-2">
                        <h1 className="text-[#ffa502] font-bold text-3xl">Power House Fitness</h1>
                    </div>
                </div>
                <ul className="flex items-center xl:gap-12 gap-x-4 max-lg:hidden">
                    <a href="#" className="leading-normal no-underline text-black text-lg hover:text-black">Home</a>
                    <a href="#" className="leading-normal no-underline text-light text-lg hover:text-black">Ticket</a>
                    <a href="#" className="leading-normal no-underline text-light text-lg hover:text-black">Explore</a>
                    <a href="#" className="leading-normal no-underline text-light text-lg hover:text-black">Activity</a>
                </ul>
                <div className="flex gap-4 max-lg:hidden">
                    <button className="bg-transparent rounded shadow h-12 px-6 outline-none text-light hover:bg-[#ffa502] hover:text-white cursor-pointer text-base transition-bg hover:border hover:border-primary">Sign In</button>
                    <button className="bg-[#ffa502] rounded shadow h-12 px-6 outline-none text-white hover:bg-white hover:text-[#ffa502] cursor-pointer text-base transition-bg hover:border hover:border-primary">Sign Up</button>
                </div>
                {dropdown ? (
                    <div onClick={showDropdown} className="lg:hidden text-[22px] cursor-pointer text-black"><MdClose/></div>) : (
                    <div onClick={showDropdown} className="lg:hidden text-[22px] cursor-pointer text-black"><HiMenuAlt3/></div>)}
            </div>
            {dropdown && (<div className="lg:hidden w-full fixed top-24 bg-blue-400 transition-all">
                <div className="w-full flex flex-col items-baseline gap-4">
                    <ul className="flex flex-col justify-center w-full">
                        <a href="#" className="px-6 h-10 flex items-center leading-normal no-underline text-white font-bold text-lg hover:bg-[#ffa502] text-[15px] border-0 border-b border-[#ffffffla] border-solid">Home</a>
                        <a href="#" className="px-6 h-10 flex items-center leading-normal no-underline text-white font-bold text-lg hover:bg-[#ffa502] text-[15px] border-0 border-b border-[#ffffffla] border-solid">Ticket</a>
                        <a href="#" className="px-6 h-10 flex items-center leading-normal no-underline text-white font-bold text-lg hover:bg-[#ffa502] text-[15px] border-0 border-b border-[#ffffffla] border-solid">Explore</a>
                        <a href="#" className="px-6 h-10 flex items-center leading-normal no-underline text-white font-bold text-lg hover:bg-[#ffa502] text-[15px] border-0 border-b border-[#ffffffla] border-solid">Activity</a>
                    </ul>
                </div>
            </div>)}
        </div>
    </nav>)
}