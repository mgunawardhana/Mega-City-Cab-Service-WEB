// eslint-disable-next-line no-unused-vars
import React from "react";
import {FaCalendar, FaSearch} from "react-icons/fa";
import {FaLocationPin, FaPerson} from "react-icons/fa6";
import {Chip} from "@mui/material";

export default function LandingPage() {

    return (<div className="container mx-auto px-6 pt-12">
        <div className="relative rounded-2xl lg:pb-32 lg:h-[70vh]">
            <div className="relative lg:absolute top-0 w-full lg:h-[70vh] h-[30rem] rounded-2xl overflow-hidden">
                <video
                    src="https://videos.pexels.com/video-files/5354693/5354693-uhd_2560_1440_24fps.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {/* Adjust opacity for darkness */}
            </div>
            <div className="absolute inset-0 h-fit">
                <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl flex justify-center mt-8 md:mt-16 font-bold lg:w-4/5 mx-auto text-center">
                    Driving You Towards a Better Tomorrow
                </h1>
                <p className="flex justify-center text-white mt-4 px-4 sm:px-6 md:px-12 lg:px-16 text-sm sm:text-base md:text-lg lg:text-xl text-center">
                    Committed to enhancing lives by providing safe, reliable, and innovative transportation solutions
                    today for a smoother tomorrow.
                </p>
            </div>

            <div className="lg:w-4/5 mx-auto lg:h-[70vh] h-full">
                <div className="bg-white px-8 py-8 rounded-[10px] lg:absolute bottom-16 lg:w-4/5 shadow-lg">
                    <div className="lg:flex gap-4">
                        <div className="flex flex-wrap gap-x-6 w-full">
                            <div
                                className="rounded-sm flex gap-x-2 items-center focus:outline-none h-14 text-base cursor-pointer "
                            >
                                Verify the availability of your preferred Driver or Vehicle.
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="mr-8 whitespace-nowrap">Driver Availability:</span>
                            <Chip label="Search Availability!" color="warning"/>
                        </div>


                    </div>
                    <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 py-4 mt-4">
                        <div className="relative h-10 w-40 flex items-center">
                            <FaLocationPin className="text-[#ffa502] absolute left-2"/>
                            <input
                                type="text"
                                placeholder="Choose Location"
                                className="bg-light1 rounded-md pl-8 py-2 w-full outline-none"
                            />
                        </div>
                        <div className="relative h-10 w-40 flex items-center">
                            <FaCalendar className="text-[#ffa502] absolute left-2"/>
                            <input
                                type="date"
                                defaultValue="2022-02-12"
                                className="bg-light1 rounded-md pl-8 py-2 w-full outline-none"
                            />
                        </div>
                        <div className="relative h-10 w-40 flex items-center">
                            <FaCalendar className="text-[#ffa502] absolute left-2"/>
                            <input
                                type="date"
                                defaultValue="2022-03-12"
                                className="bg-light1 rounded-md pl-8 py-2 w-full outline-none"
                            />
                        </div>
                        <div className="relative h-10 w-40 flex items-center">
                            <FaPerson className="text-[#ffa502] absolute left-2"/>
                            <input
                                type="text"
                                placeholder="Search Trainer"
                                className="bg-light1 rounded-md pl-8 py-2 w-full outline-none"
                            />
                        </div>
                        <button className="bg-[#ffa502] text-white py-2 px-4 rounded-md flex items-center">
                            <FaSearch className="mr-2"/> Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
