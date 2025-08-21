import { Link } from "react-router-dom";
import env from "@/env";
export const Brand = () => {
    return (
        <Link to={"/"}>
            <div className=''>
                <img src={env.APP_LOGO_URL} className="h-[3rem] " alt='Nexah' />
            </div>
        </Link>
    );
};