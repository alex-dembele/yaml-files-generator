import { BackArrow, BackgroundContainer, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReceiptScanner from "@/modules/shared/RecieptScanner";

const ScanRecieptPage = () => {
    const navigate = useNavigate();
    const { salespointUUID } = useParams();

    const [currentStep,] = useState(3);
    const [progress,] = useState(75);

    const handleBack = () => {
        navigate(`/${salespointUUID}`);
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
                <ReceiptScanner
                // isProcessing={scanReceiptMutation.isPending}
                // onError={scanReceiptMutation.isError}
                // onReceiptImageProcess={handleReceiptProcess}
                />

                {/* Continue button */}
                {/* <div className="flex-grow flex flex-col justify-center  items-center ">
                    {checkPlayerIdentityMutation.isPending ? (
                        <MoonLoader size={16} />
                    ) : (
                        <ContinueButton
                            onContinue={handleContinue}
                            disabled={!inputValue.trim()}
                        />
                    )}

                </div> */}
            </div>
        </BackgroundContainer>
    );
};

export default ScanRecieptPage;