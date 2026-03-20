import React from "react";
import HomeNavBar from "../components/HomeNavBar";

export const TermsOfService = () => {
    return (
        <div className="min-h-screen animate-fade-down animate-delay-200 bg-cover bg-center bg-[url(/samurai-champloo-3.jpg)] text-white">
            <HomeNavBar/>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold">Terms of Service</h1>
                <p className="text-gray-400">Effective Date: March 19, 2026</p>

                <Section title="1. Acceptance">
                    By using AniMatch, you agree to these terms.
                </Section>

                <Section title="2. Use of Service">
                    <ul className="list-disc ml-6 space-y-2">
                        <li>No abuse or hacking</li>
                        <li>No unauthorized access</li>
                        <li>Use lawfully</li>
                    </ul>
                </Section>

                <Section title="3. Accounts">
                    You are responsible for your account. We may suspend accounts that violate rules.
                </Section>

                <Section title="4. Disclaimer">
                    Service is provided "as is" without warranties.
                </Section>

                <Section title="5. Liability">
                    We are not liable for damages from using the service.
                </Section>

                <Section title="6. Contact">
                    support@animatch.dev
                </Section>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-300 leading-relaxed">{children}</p>
    </div>
);

export default TermsOfService;