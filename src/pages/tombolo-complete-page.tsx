import { BackArrow, BackgroundContainer, ProgressLine, StepCompletedCard, StepCompleteIndicator } from "@/modules/shared/components";
import { useState } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TombolaCompletePage = () => {
    // const { t } = useTranslation();
    const navigate = useNavigate();


    const [progress,] = useState(100);

    const handleBack = () => {
        navigate(`/`);
    };

    // const handleContinue = () => {
    //     navigate(`/`);
    // }


    return (
        <BackgroundContainer>
            <div className=" flex flex-col justify-center  flex-grow gap-y-7 px-6 pt-6 pb-6">
                {/* Header with back arrow and step indicator */}
                <div className="flex space-x-2 items-center">
                    <BackArrow onBack={handleBack} />
                    <StepCompleteIndicator />
                </div>

                {/* Progress line with truck */}
                <ProgressLine progress={progress} />

                {/* Step completed card */}
                <StepCompletedCard />
                {/* Continue button */}
                {/* <div className="flex-grow flex flex-col justify-center  items-center ">
                    <ContinueButton
                        text={t('tombola_completed.back_to_home_btn')}
                        onContinue={handleContinue}
                    />
                </div> */}
            </div>
        </BackgroundContainer>
    );

}

export default TombolaCompletePage;