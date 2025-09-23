import { BackgroundContainer, CheckRuleButton, ContinueButton } from "@/modules/shared/components"
import carrefourPrimaryBg from '@/assets/images/carrefour-main-bg.png';
import sloganSectionLogo from '@/assets/images/slogon-section.png';
import { useNavigate } from "react-router-dom";
// import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const CheckSalespointPage = () => {
    const { t } = useTranslation();
    // const { salespointUUID } = useParams();
    // const { data, isLoading } = useSalespointVerifyIdentity(salespointUUID);

    const navigate = useNavigate();
    const handleContinue = () => {
        navigate(`/identity-check`);
        // Logic to navigate to the next step or page
        console.log("Continue button clicked");
    }

    // if (isLoading) {
    //     return <div className="flex items-center justify-center flex-grow">
    //         <MoonLoader size={20} />
    //     </div>
    // }
    // console.log("data from useSalespointVerifyIdentity:", data);
    // if (data && data?.status === 200) {
    return (
        <BackgroundContainer
            backgroundImage={carrefourPrimaryBg}
            overlayColor="rgba(255, 255, 255, 0.0)"
        >
            <div className=" flex flex-col flex-grow px-8 py-6 gap-y-7 items-center  text-center pt-16">
                <div className=" w-full flex justify-center">
                    <img src={sloganSectionLogo} className=" w-5/6" />
                </div>
                <div >
                    <p className="text-xl font-semibold text-white" >{t('check_salespoint.slogan_p1')} <span className="bg-blue-700 p-1">{t('check_salespoint.slogan_p2')}</span> {t('check_salespoint.slogan_p3')}<span className="bg-blue-700 p-1">{t('check_salespoint.slogan_p4')}</span> </p>
                </div>
                <div className="mt-3 w-full space-y-2">
                    <ContinueButton
                        text={t('check_salespoint.play_now')}
                        onContinue={handleContinue}
                        disabled={false}
                    />
                    <CheckRuleButton />
                </div>
            </div>
        </BackgroundContainer>
    )
}
// return (
//     <BackgroundContainer
//         backgroundImage={carrefourPrimaryBg}
//         overlayColor="rgba(255, 255, 255, 0.0)"
//     >
//         <div className=" flex flex-col flex-grow px-8 py-6 gap-y-7 items-center  text-center pt-24">
//             <div className=" w-full flex justify-center">
//                 <img src={sloganSectionLogo} className=" w-5/6" />
//             </div>
//             <div >
//                 <p className="text-xl font-semibold text-white" >{t('check_salespoint.not_available')}</p>
//             </div>
//         </div>
//     </BackgroundContainer>
// )


// }

export default CheckSalespointPage