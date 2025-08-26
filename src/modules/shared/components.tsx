/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import carrefourPrimaryBg from '@/assets/images/carrefour-main-bg.png';
import confettiImg from "@/assets/images/confettis.png";

// 1. Background Container with Color Overlay
export const BackgroundContainer = ({
    backgroundImage = carrefourPrimaryBg,
    overlayColor = "rgba(0, 174, 239, 0.7)",
    children
}: any) => {
    return (
        <div
            className=" flex flex-col flex-grow relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div
                className="absolute inset-0"
                style={{ backgroundColor: overlayColor }}
            />
            <div className="relative z-10 flex flex-col flex-grow ">
                {children}
            </div>
        </div>
    );
};

// 2. Back Arrow Component
export const BackArrow = ({ onBack }: any) => {
    return (
        <button
            onClick={onBack}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
    );
};

// 3. Step Indicator Component
export const StepIndicator = ({ currentStep, totalSteps }: any) => {
    return (
        <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-md">
            Étape {currentStep} sur {totalSteps}
        </div>
    );
};

export const StepCompleteIndicator = () => {
    return (
        <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-md">
            Terminé !
        </div>
    );
};

export const StepCompletedCard = () => {
    return (
        <div className="bg-white rounded-2xl  shadow-lg px-8 py-3   text-center">
            <h2 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                Félicitations !
            </h2>
            <div>
                <img
                    src={confettiImg}
                    alt="Success"
                    className="w-72 mx-auto mb-4" />
            </div>
            <div>
                <h4 className='text-gray-600'>
                    Votre participation a bien été enregistrée
                </h4>
            </div>
        </div>
    );
}

// 4. Progress Line with Truck Component
export const ProgressLine = ({
    progress = 0,
    // truckIcon = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
}) => {
    return (
        <div className="relative w-full max-w-md mx-auto my-6">
            {/* Background line */}
            <div className="w-full h-3 bg-white  rounded-full">
                {/* Progress line */}
                <div
                    className="h-3 bg-red-500 rounded-full transition-all duration-300 ease-in-out relative"
                    style={{ width: `${progress}%` }}
                >
                    {/* Truck icon */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out"
                        style={{ left: `${Math.max(10, progress)}%` }}
                    >
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. Input Card Component
export const InputCard = ({
    label = "Quel est votre nom ?",
    placeholder = "Entrer votre nom",
    value = "",
    onChange,
    type = "text",
    disabled = false
}: any) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg  py-10">
            <h2 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                {label}
            </h2>
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 my-5 border border-gray-200 rounded-full bg-slate-50 text-center placeholder:font-bold font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
        </div>
    );
};

// 6. Continue Button Component
export const ContinueButton = ({ onContinue, disabled = false, text = "Continuer" }: any) => {
    return (
        <button
            onClick={onContinue}
            disabled={disabled}
            className={`w-full  block px-6 py-4 rounded-xl text-xl  font-semibold transition-all duration-200 ${disabled
                ? 'bg-blue-950 text-gray-50 cursor-not-allowed   active:bg-blue-800 shadow-lg hover:shadow-xl'
                : 'bg-blue-950  text-white'
                }`}
        >
            {text}
        </button>
    );
};

// Demo Component showing all components in action
// const CarrefourDemo = () => {
//     const [currentStep, setCurrentStep] = useState(1);
//     const [progress, setProgress] = useState(25);
//     const [inputValue, setInputValue] = useState("");

//     const handleBack = () => {
//         if (currentStep > 1) {
//             setCurrentStep(currentStep - 1);
//             setProgress(progress - 25);
//         }
//     };

//     const handleContinue = () => {
//         if (currentStep < 4) {
//             setCurrentStep(currentStep + 1);
//             setProgress(progress + 25);
//         }
//     };

//     const handleInputChange = (value:) => {
//         setInputValue(value);
//     };

//     return (
//         <BackgroundContainer>
//             <div className="p-4 space-y-6">
//                 {/* Header with back arrow and step indicator */}
//                 <div className="flex justify-between items-center">
//                     <BackArrow onBack={handleBack} />
//                     <StepIndicator currentStep={currentStep} totalSteps={4} />
//                 </div>

//                 {/* Progress line with truck */}
//                 <ProgressLine progress={progress} />

//                 {/* Input card */}
//                 <InputCard
//                     label="Quel est votre nom ?"
//                     placeholder="Entrer votre nom"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                 />

//                 {/* Continue button */}
//                 <div className="px-4">
//                     <ContinueButton
//                         onContinue={handleContinue}
//                         disabled={!inputValue.trim()}
//                     />
//                 </div>

//                 {/* Demo info */}
//                 <div className="text-center text-white text-sm opacity-75 mt-8">
//                     <p>Current step: {currentStep}/4</p>
//                     <p>Progress: {progress}%</p>
//                     <p>Input value: "{inputValue}"</p>
//                 </div>
//             </div>
//         </BackgroundContainer>
//     );
// };

// export default CarrefourDemo;