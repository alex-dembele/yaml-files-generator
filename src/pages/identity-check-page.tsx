import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckPlayerIdentity } from '@/modules/players/hooks'
import { MoonLoader } from "react-spinners";
import { IPlayerCheckIdentityRequest } from "@/modules/players/api";

const IdentityCheckPage = () => {
    const { salespointUUID } = useParams();
    const navigate = useNavigate();

    const checkPlayerIdentityMutation = useCheckPlayerIdentity();

    const [currentStep,] = useState(1);
    const [progress,] = useState(25);
    const [inputValue, setInputValue] = useState("");

    const handleBack = () => {
        navigate(`/${salespointUUID}`);
    };

    const handleContinue = () => {
        const payload: IPlayerCheckIdentityRequest = {
            phone_number: inputValue
        }
        console.log("Payload: ", payload);
        checkPlayerIdentityMutation.mutate(payload)
    };

    const handleInputChange = (value: string) => {
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
                    disabled={checkPlayerIdentityMutation.isPending}
                    label="Quel est votre numéro de téléphone ?"
                    placeholder="Entrer votre numéro"
                    value={inputValue}
                    onChange={handleInputChange}
                />

                {/* Continue button */}
                <div className="flex-grow flex flex-col justify-center  items-center ">
                    {checkPlayerIdentityMutation.isPending ? (
                        <MoonLoader size={16} />
                    ) : (
                        <ContinueButton
                            onContinue={handleContinue}
                            disabled={!inputValue.trim()}
                        />
                    )}

                </div>
            </div>
        </BackgroundContainer>
    );
};

export default IdentityCheckPage;