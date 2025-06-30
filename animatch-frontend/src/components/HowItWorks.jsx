import React from "react";
import { motion } from "framer-motion";
import StyledButton from "./Buttons/StyledButton";
import {MonitorPlayIcon, PuzzlePieceIcon, MagicWandIcon} from '@phosphor-icons/react'


function HowItWorks() {
    const steps = [
        {
            icon: MagicWandIcon,
            alt: "Choose Preferences Icon",
            title: "Choose Your Preferences",
            description: "Tell us what you enjoy watching",
        },
        {
            icon: PuzzlePieceIcon,
            alt: "Receive Tailored Recommendations Icon",
            title: "Receive Tailored Recommendations",
            description: "The algorithm and AI finds perfect matches based on your taste",
        },
        {
            icon: MonitorPlayIcon,
            alt: "Start Watching Anime Icon",
            title: "Start Watching",
            description: "Dive into new worlds that match with your interests",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center bg-cover bg-center bg-gradient-to-t from-black/70 to-transparent bg-[url(/afro-samurai-1.jpg)] min-h-screen text-white">
            <section className="mt-32 px-8">
                <h2 className="text-4xl font-extrabold mb-10 text-center text-black">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="bg-black/90 shadow-lg rounded-xl p-6 flex flex-col items-center text-center space-y-4 transform hover:scale-105 transition duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <step.icon size={50} className="text-white mb-4"  alt={step.alt}/>
                            <h3 className="text-xl font-semibold text-white">
                                {step.title}
                            </h3>
                            <p className="text-white">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-10 flex justify-center">
                    <StyledButton Text={'Get Started'}/>
                </div>
            </section>
        </div>
    );
}

export default HowItWorks;
