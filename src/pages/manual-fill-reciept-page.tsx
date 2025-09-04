import { BackArrow, BackgroundContainer, ContinueButton, InputCard, ProgressLine, StepIndicator } from "@/modules/shared/components";
import { useManualFillReciept } from "@/modules/tombola/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const ManualFillRecieptPage = () => {
    const { t } = useTranslation();
    const { salespointUUID, identityUUID } = useParams();
    const actionMutation = useManualFillReciept();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(3);
    const [progress, setProgress] = useState(75);
    const [transactionNo, setTransactionNo] = useState("");
    const [amount, setAmount] = useState("");

    const handleBack = () => {
        navigate(`/${salespointUUID}/identity-check/${identityUUID}/scan-receipt`);
    };

    const handleContinue = () => {
        if (currentStep === 3) {
            setCurrentStep(4);
            setProgress(87);
        } else if (currentStep === 4) {
            if (salespointUUID && identityUUID) {
                const payload = {
                    transactionNo: transactionNo,
                    amount: amount,
                    salesPointId: salespointUUID,
                    clientId: identityUUID
                }
                actionMutation.mutate(payload);
            }

        }
    };

    const handleTransactionNoChange = (value: string) => {
        setTransactionNo(value);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
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

                {currentStep === 3 && (
                    <>
                        <InputCard
                            helperText={t('manual_fill_reciept.input_card.transaction_no.helperText')}
                            type={"text"}
                            key={"update-transaction_no"}
                            label={t('manual_fill_reciept.input_card.transaction_no.label')}
                            placeholder={t('manual_fill_reciept.input_card.transaction_no.placeholder')}
                            value={transactionNo}
                            onChange={handleTransactionNoChange}
                        />

                        <div className="flex-grow flex flex-col justify-center  items-center ">
                            <ContinueButton
                                onContinue={handleContinue}
                                disabled={!transactionNo.trim()}
                            />

                        </div>
                    </>
                )}

                {currentStep === 4 && (
                    <>
                        <InputCard
                            key={"update-amount"}
                            label={t('manual_fill_reciept.input_card.amount.label')}
                            placeholder={t('manual_fill_reciept.input_card.amount.placeholder')}
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        <div className="flex-grow flex flex-col justify-center  items-center ">
                            {actionMutation.isPending ? (
                                <MoonLoader size={16} />
                            ) : (
                                <ContinueButton
                                    onContinue={handleContinue}
                                    disabled={!amount.trim()}
                                />
                            )}


                        </div>
                    </>
                )}


            </div>
        </BackgroundContainer>
    );
};

export default ManualFillRecieptPage;