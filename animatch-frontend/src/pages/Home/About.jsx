import React from "react";
import { motion } from "framer-motion";
import SpotlightCard from '../../components/Cards/SpotlightCard';
import AniMatchTechStack from "../../components/AniMatchTechStack";
import StyledButton from "../../components/Buttons/StyledButton";
import HomeNavBar from "../../components/HomeNavBar";

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
            
            <div className="bg-[url(/1354199.jpeg)] min-h-screen bg-center bg-cover">
            <HomeNavBar />
                <div className="flex items-center justify-center px-4 sm:px-6">
                    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 text-white mt-10 sm:mt-20 lg:mt-30">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="mb-8 sm:mb-12 text-center bg-black/50 rounded-2xl p-4 sm:p-6"
                        >
                            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                Welcome to AniMatch!
                            </motion.h1>
                            <motion.p className="text-base sm:text-lg mt-2" variants={itemVariants}>
                                Your personalized anime recommendation platform
                            </motion.p>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                        >
                            <motion.div
                                variants={itemVariants}
                            >
                                <SpotlightCard spotlightColor="rgba(64, 180, 100, 0.2)" className="h-full">
                                    <motion.h2
                                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-400"
                                        variants={itemVariants}>
                                        About AniMatch
                                    </motion.h2>
                                    <motion.p
                                        className="text-sm sm:text-base"
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
                                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-400"
                                        variants={itemVariants}>
                                        Our Mission
                                    </motion.h2>
                                    <motion.p
                                        className="text-sm sm:text-base"
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
                                    <AniMatchTechStack />
                                </SpotlightCard>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                            >
                                <SpotlightCard spotlightColor="rgba(180, 64, 100, 0.2)" className="h-full">
                                    <motion.h2
                                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-400"
                                        variants={itemVariants}>
                                        Start The Adventure
                                    </motion.h2>
                                    <motion.p
                                        className="text-sm sm:text-base"
                                        variants={itemVariants}
                                    >
                                        Start your adventure today and get started by clicking the button below!
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
            </div>
        </>

    );
};

export default About;