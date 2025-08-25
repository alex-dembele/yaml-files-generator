import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const UpdateInfoPage = () => {
    const { salespointUUID } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [progress, setProgress] = useState(25);
    const [inputValue, setInputValue] = useState("");

    const handleBack = () => {
        navigate(`/${salespointUUID}`);
    };

    const handleContinue = () => {
        if (inputValue !== "653618276") {
            setCurrentStep(2);
            setProgress(progress + 25);
            navigate(`/${salespointUUID}/identity-check/cc030673-5d9a-11f0-8012-0acc3673109d/update-info`);
        } else {
            setCurrentStep(4);
            setProgress(100);
            navigate(`/${salespointUUID}/identity-check/cc030673-5d9a-11f0-8012-0acc3673109d/scan-receipt `);
        }
    };

    const handleInputChange = (value) => {
        setInputValue(value);
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

                {/* Input card */}
                <InputCard
                    label="Quel est votre numéro de téléphone ?"
                    placeholder="Entrer votre numéro"
                    value={inputValue}
                    onChange={handleInputChange}
                />

                {/* Continue button */}
                <div className="flex-grow flex flex-col justify-center  items-center ">
                    <ContinueButton
                        onContinue={handleContinue}
                        disabled={!inputValue.trim()}
                    />
                </div>
            </div>
        </BackgroundContainer>
    );
};

export default UpdateInfoPage;