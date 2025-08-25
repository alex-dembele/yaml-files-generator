import { BackgroundContainer, ContinueButton } from "@/modules/shared/components"
import carrefourPrimaryBg from '@/assets/images/carrefour-main-bg.png';
import sloganSectionLogo from '@/assets/images/slogon-section.png';
import { useNavigate, useParams } from "react-router-dom";
import { useSalespointVerifyIdentity } from "@/modules/salespoints/hooks";

const CheckSalespointPage = () => {
    const { salespointUUID } = useParams();
    const { data, isLoading } = useSalespointVerifyIdentity(salespointUUID);

    const navigate = useNavigate();
    const handleContinue = () => {
        navigate(`/${salespointUUID}/identity-check`);
        // Logic to navigate to the next step or page
        console.log("Continue button clicked");
    }

    if (isLoading) {
        return <div className="flex items-center justify-center flex-grow">Loading...</div>
    }
    console.log("data from useSalespointVerifyIdentity:", data);
    if (data && data?.status === 200) {
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
                    <p className="text-xl font-semibold text-white" >Désolé, la tombola n'est pas disponible dans ce point de vente.</p>
                </div>
            </div>
        </BackgroundContainer>
    )


}

export default CheckSalespointPage