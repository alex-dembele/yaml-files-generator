import { IPlayerUpdateInfosRequest } from "@/modules/players/api";
import { usePlayerUpdateInfos } from "@/modules/players/hooks";
import { useSalesPointList } from "@/modules/salespoints/hooks";
import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";


const UpdateInfoPage = () => {
    const { t } = useTranslation();
    const { identityUUID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const updateInfosMutation = usePlayerUpdateInfos();
    const { data: salespoints } = useSalesPointList();

    console.log("Salespooint: ", salespoints);

    const { username, address } = location.state || {};
    const [currentStep,] = useState(2);
    const [progress,] = useState(50);
    const [usernameInput, setUsername] = useState(username ?? "");
    const [addressInput, setAddress] = useState(address ?? "");
    const [salespointUUID, setSalespointUUID] = useState("");

    const handleBack = () => {
        navigate(`/`);
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
    };

    const handleSalespointChange = (value: string) => {
        setSalespointUUID(value);
    };

    const handleContinue = () => {

        if (salespointUUID && identityUUID) {
            const payload: IPlayerUpdateInfosRequest = {
                name: usernameInput,
                address: addressInput,
                salesPointId: salespointUUID,
                clientId: identityUUID
            }
            updateInfosMutation.mutate(payload);
        }

    };


    if (salespoints) {
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
                            value={usernameInput}
                            onChange={handleUsernameChange}
                        />

                        <InputCard
                            isGrouped
                            key={"update-info-address"}
                            label={t('update_info.input_card.address.label')}
                            placeholder={t('update_info.input_card.address.placeholder')}
                            value={addressInput}
                            onChange={handleAddressChange}
                        />


                        <InputCard
                            required
                            isSelect
                            options={salespoints.map((salespoint => ({ label: salespoint.name, value: salespoint.uuid })))}
                            isGrouped
                            key={"salespoint-input"}
                            label={t('update_info.input_card.salespoint.label')}
                            placeholder={t('update_info.input_card.salespoint.placeholder')}
                            value={salespointUUID}
                            onChange={handleSalespointChange}
                        />


                    </div>
                    <div className="flex-grow flex flex-col justify-center  items-center ">
                        {updateInfosMutation.isPending ? (
                            <MoonLoader size={16} />
                        ) : (
                            <ContinueButton
                                text={t('update_info.btn.validate.label')}
                                onContinue={handleContinue}
                                disabled={!addressInput.trim() || !usernameInput.trim() || !salespointUUID.trim()}
                            />
                        )}
                    </div>

                </div>
            </BackgroundContainer>
        );
    }


};

export default UpdateInfoPage;