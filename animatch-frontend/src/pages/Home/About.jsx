import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from '../../components/Cards/SpotlightCard';
import AniMatchTechStack from "../../components/AniMatchTechStack";
import StyledButton from "../../components/Buttons/StyledButton";

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <>
            <div className="flex items-center justify-center bg-[url(/1354199.jpeg)] min-h-screen bg-center bg-cover">
                <div className="max-w-4xl mx-auto p-6 text-white">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="mb-12 text-center"
                    >
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold ">
                            Welcome to AniMatch!
                        </motion.h1>
                        <motion.p className="text-lg" variants={itemVariants}>
                            Your personalized anime recommendation platform
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-rows-4 gap-6"
                    >
                        <motion.div
                            variants={itemVariants}
                        >
                            <SpotlightCard spotlightColor="rgba(64, 180, 100, 0.2)" className="h-full">
                                <motion.h2
                                    className="text-3xl font-bold mb-4 text-gray-400"
                                    variants={itemVariants}>
                                    About AniMatch
                                </motion.h2>
                                <motion.p
                                    variants={itemVariants}
                                >
                                    AniMatch offers deep personalized recommendations. Driven by user data and input AniMatch aims to give more tailored recommendations to our users.
                                    Using AI we are able to give nuanced recommendations, while also giving justification for its recommendations.
                                </motion.p>
                            </SpotlightCard>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                        >
                            <SpotlightCard className="h-full" spotlightColor="rgba(64, 180, 100, 0.2)">
                                <motion.h2
                                    className="text-3xl font-bold mb-4 text-gray-400"
                                    variants={itemVariants}>
                                    Our Mission
                                </motion.h2>
                                <motion.p
                                    variants={itemVariants}
                                >
                                    AniMatch caters to both new and old anime watchers alike.
                                    Whether you're a casual viewer trying to find where to start or a seasoned anime fan looking for new niche anime, AniMatch has something for everyone!
                                </motion.p>
                            </SpotlightCard>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                        >
                            <SpotlightCard spotlightColor="rgba(180, 64, 100, 0.2)" className="h-full">
                                <motion.h2
                                    className="text-3xl font-bold mb-4 text-gray-400"
                                    variants={itemVariants}>
                                    What Powers AniMatch
                                </motion.h2>
                                <AniMatchTechStack />
                            </SpotlightCard>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                        >
                            <SpotlightCard spotlightColor="rgba(180, 64, 100, 0.2)" className="h-full">
                                <motion.h2
                                    className="text-3xl font-bold mb-4 text-gray-400"
                                    variants={itemVariants}>
                                    Start The Adventure
                                </motion.h2>
                                <motion.p
                                    variants={itemVariants}
                                >
                                    Start you adventure today and get started by click the button below!
                                </motion.p>
                                <motion.button
                                    variants={itemVariants}
                                    className="mt-4"
                                >
                                    <StyledButton
                                        Text="Get Started"

                                    />
                                </motion.button>
                            </SpotlightCard>
                        </motion.div>
                    </motion.div>
                </div>

            </div>
        </>

    );
};

export default About;
