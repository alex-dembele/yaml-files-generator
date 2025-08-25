import { BackgroundContainer, ContinueButton } from "@/modules/shared/components"
import carrefourPrimaryBg from '@/assets/images/carrefour-main-bg.png';
import sloganSectionLogo from '@/assets/images/slogon-section.png';
import { useNavigate, useParams } from "react-router-dom";

const TombolaCompletePage = () => {
    const { salespointUUID } = useParams();
    const navigate = useNavigate();
    const handleContinue = () => {
        navigate(`/${salespointUUID}/identity-check`);
        // Logic to navigate to the next step or page
        console.log("Continue button clicked");
    }

    return (
        <BackgroundContainer
            backgroundImage={carrefourPrimaryBg}
            overlayColor="rgba(255, 255, 255, 0.0)"
        >
            <div className=" flex flex-col flex-grow px-8 py-6 gap-y-7 items-center  text-center pt-24">
                <div bg-white className=" w-full flex justify-center">
                    <img src={sloganSectionLogo} className=" w-5/6" />
                </div>
                <div >
                    <p className="text-xl font-semibold text-white" >Participez à notre <span className="bg-blue-700 p-1">grande tombola</span> anniversaire et tentez de repartir avec des <span className="bg-blue-700 p-1">cadeaux de folie !</span> </p>
                </div>
                <div className="mt-3 w-full">
                    <ContinueButton
                        text="Jouer maintenant"
                        onContinue={handleContinue}
                        disabled={false}
                    />
                </div>
            </div>
        </BackgroundContainer>
    )
}

export default TombolaCompletePage