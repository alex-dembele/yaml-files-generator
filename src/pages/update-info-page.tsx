import { IPlayerUpdateInfosRequest } from "@/modules/players/api";
import { usePlayerUpdateInfos } from "@/modules/players/hooks";
import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";


const UpdateInfoPage = () => {
    const { t } = useTranslation();
    const { salespointUUID, identityUUID } = useParams();
    const updateInfosMutation = usePlayerUpdateInfos();
    const navigate = useNavigate();

    const [currentStep,] = useState(2);
    const [progress,] = useState(50);
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");

    const handleBack = () => {
        navigate(`/${salespointUUID}`);
    };

    const handleContinue = () => {

        if (salespointUUID && identityUUID) {
            const payload: IPlayerUpdateInfosRequest = {
                name: username,
                address: address,
                salesPointId: salespointUUID,
                clientId: identityUUID
            }
            updateInfosMutation.mutate(payload);
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
                <div className="bg-white rounded-2xl">
                    <InputCard
                        isGrouped
                        key={"update-info-name"}
                        label={t('update_info.input_card.username.label')}
                        placeholder={t('update_info.input_card.username.placeholder')}
                        value={username}
                        onChange={handleUsernameChange}
                    />

                    <InputCard
                        isGrouped
                        key={"update-info-address"}
                        label={t('update_info.input_card.address.label')}
                        placeholder={t('update_info.input_card.address.placeholder')}
                        value={address}
                        onChange={handleAddressChange}
                    />

                </div>
                <div className="flex-grow flex flex-col justify-center  items-center ">
                    {updateInfosMutation.isPending ? (
                        <MoonLoader size={16} />
                    ) : (
                        <ContinueButton
                            text={t('update_info.btn.validate.label')}
                            onContinue={handleContinue}
                            disabled={!address.trim() || !username.trim()}
                        />
                    )}
                </div>

            </div>
        </BackgroundContainer>
    );
};

export default UpdateInfoPage;