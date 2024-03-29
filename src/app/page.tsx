"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MeasurementForm from "@/app/_components/MeasurementForm";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import PricingPlans from "@/app/_components/PricingPlans";
import FeatureSection from "@/app/_components/FeatureSection";
import TrustedBy from "@/app/_components/TrustedBy";

const Homepage = () => {
    return (
        <motion.div
            className="h-full"
            initial={{ y: "400vh" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1 }}
        >
            <div className=" h-auto md:h-full p:0 overflow-y-scroll justify-center">
                <div className={'flex  h-[calc(100vh-4rem)]  flex-col overflow-y-scroll flex-wrap justify-center lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 '}>
                    {/* TEXT CONTAINER */}
                    <div className="p-2 flex flex-col gap-8 items-center lg:justify-center ">
                        {/* TITLE */}
                        <h1 className="text-4xl md:text-6xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-l from-blue-900 to-red-400">
                            Revolutionizing Heart Disease Prediction.
                        </h1>
                        {/* DESC */}
                        <p className="md:text-xl color">
                            heart.io makes it easy to predict cardiovascular disease risks accurately, enabling early detection and
                            proactive management. All this powered by machine learning .
                        </p>

                        {/* BUTTONS */}
                        <div className={"flex flex-col items-center justify-center"}>
                            <div className="w-full flex gap-4">
                                <Button asChild>
                                    <Link href="/about">About</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/registration/organization">Register</Link>
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
                <FeatureSection/>
                <PricingPlans/>
                <TrustedBy/>
            </div>
        </motion.div>
    );
};

export default Homepage;