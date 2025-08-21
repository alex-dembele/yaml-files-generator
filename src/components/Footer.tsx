import ToggleLanguage from '../translations/components/ToggleLanguage';



export const Footer = () => {
    const getFullYear = () => {
        const date = new Date();
        const year = date.getFullYear();
        // const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        // const day = String(date.getDate()).padStart(2, "0");
        return `${year}`;
    };

    return (
        // bg-[#004bad]
        <div className=" flex items-center justify-end px-4 border-t border-gray-400 py-2 space-x-2 ">
            <div className='mr-auto'>v{import.meta.env.VITE_APP_BUILD_VERSION}</div>
            <ToggleLanguage color="" dropdown />

            <h5 className='text-black' >&copy; {getFullYear()} Nexah Sarl</h5>

        </div>

    )
}

