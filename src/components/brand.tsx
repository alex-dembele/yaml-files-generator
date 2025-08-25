import { Link } from "react-router-dom";
import carrefourLogo from "@/assets/logo/carrefour-logo.png"
export const Brand = () => {
    return (
        <Link to={"/"}>
            <div className=''>
                <img src={carrefourLogo} className="h-[3rem] " alt='Carrefour' />
            </div>
        </Link>
    );
};