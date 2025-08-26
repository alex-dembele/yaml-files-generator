import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const UpdateInfoPage = () => {
    const { salespointUUID } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(2);
    const [progress, setProgress] = useState(50);
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");

    const handleBack = () => {
        navigate(`/${salespointUUID}`);
    };

    const handleContinue = () => {
        if (currentStep === 2) {
            setCurrentStep(3);
            setProgress(75);
        } else if (currentStep === 3) {
            console.log("Username: ", username);
            console.log("Address: ", address);
            // Final step, navigate to scan receipt page
            navigate(`/${salespointUUID}/identity-check/:identityUUID/scan-receipt`);
        }
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
    };

    return (
        <BackgroundContainer>
            <div className=" flex flex-col flex-grow gap-y-7 px-6 pt-6 pb-6">
                {/* Header with back arrow and step indicator */}
                <div className="flex space-x-2 items-center">
                    <BackArrow onBack={handleBack} />
                    <StepIndicator currentStep={currentStep} totalSteps={4} />
                </div>

                {/* Progress line with truck */}
                <ProgressLine progress={progress} />

                {currentStep === 2 && (
                    <>
                        <InputCard
                            key={"update-info-name"}
                            label="Quel est votre nom ?"
                            placeholder="Entrer votre nom"
                            value={username}
                            onChange={handleUsernameChange}
                        />

                        <div className="flex-grow flex flex-col justify-center  items-center ">
                            <ContinueButton
                                onContinue={handleContinue}
                                disabled={!username.trim()}
                            />

                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <InputCard
                            key={"update-info-address"}
                            label="Quel est votre adresse ?"
                            placeholder="Entrer votre adresse"
                            value={address}
                            onChange={handleAddressChange}
                        />
                        <div className="flex-grow flex flex-col justify-center  items-center ">
                            <ContinueButton
                                onContinue={handleContinue}
                                disabled={!address.trim()}
                            />

                        </div>
                    </>
                )}


            </div>
        </BackgroundContainer>
    );
};

export default UpdateInfoPage;