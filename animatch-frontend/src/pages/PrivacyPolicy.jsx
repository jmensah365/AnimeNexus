import React from "react";
import HomeNavBar from "../components/HomeNavBar";

export const PrivacyPolicy = () => {
    return (
        <>
            <div className="min-h-screen animate-fade-down animate-delay-200 bg-cover bg-center bg-[url(/samurai-champloo-3.jpg)] text-white ">
                <HomeNavBar />
                <div className="max-w-2xl ml-32 space-y-6">
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    <p className="text-white">Effective Date: March 19, 2026</p>

                    <Section title="1. Introduction">
                        Welcome to AniMatch. Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and your rights.
                    </Section>

                    <Section title="2. Information We Collect">
                        <ul className="list-disc ml-6 space-y-2">
                            <li><b>Account Information:</b> Name, email address</li>
                            <li><b>User Preferences:</b> Anime preferences and interactions</li>
                            <li><b>Usage Data:</b> Basic analytics</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Create and manage your account</li>
                            <li>Provide personalized recommendations</li>
                            <li>Improve the platform</li>
                        </ul>
                    </Section>

                    <Section title="4. Data Sharing">
                        We do not sell your data. We may share data with services like authentication providers and backend infrastructure.
                    </Section>

                    <Section title="5. Security">
                        We take reasonable steps to protect your data, but no system is completely secure.
                    </Section>

                    {/* <Section title="6. Your Rights">
                    You may request access or deletion of your data by contacting support@animatch.dev
                </Section> */}
                </div>
            </div>
        </>

    );
};


const Section = ({ title, children }) => (
    <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-white leading-relaxed">{children}</p>
    </div>
);

export default PrivacyPolicy;
