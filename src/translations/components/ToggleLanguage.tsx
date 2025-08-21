import { FC, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from "react-i18next";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import languages from "../languages";
import { useTranslateLanguage } from "../hooks";
import { toggleLanguage } from "../redux";

export type ToggleLanguageProps = {
    color?: string;
    rounded?: boolean;
    dropdown?: boolean
};

export const ToggleLanguage: FC<ToggleLanguageProps> = ({ color, rounded = false, dropdown }) => {
    const [showList, setShowList] = useState(false);
    const nodeRef = useRef<HTMLButtonElement>(null);

    const { lang, dispatch } = useTranslateLanguage();
    const { i18n } = useTranslation();


    const handleToggleLanguageDropdown = () => {
        setShowList((prevState) => {
            return !prevState;
        })
    }

    const handleToggleLanguage = (selectedLanguage: ILangauge) => {
        console.log("Change language.............")
        i18n.changeLanguage(selectedLanguage.key);
        // setCurrentLanguage(selectedLanguage);
        dispatch(toggleLanguage(selectedLanguage))
        setShowList(false);
    }

    useEffect(() => {
        console.log("Translation: current lang: ", lang)
        i18n.changeLanguage(lang.currentLanguage.key)

    }, [dispatch, lang, i18n])


    return (
        <div
            className="relative flex flex-col rounded-md  bg-slate-200 text-black">
            <button
                type="button"
                ref={nodeRef}
                onClick={handleToggleLanguageDropdown}
                className={twMerge(
                    "py-2 px-2 text-left  text-sm text-dark w-full flex flex-initial  items-center relative justify-between gap-1 mr-2",
                    rounded ? "rounded-lg" : "rounded-sm",
                )}
                style={{ background: color ? color : "" }}
            >
                <span className="block truncate text-sm lg:text-[0.9em]">{lang.currentLanguage.accroynm}</span>

                {showList ? (<span><IoMdArrowDropup /></span>) : (<span><IoMdArrowDropdown /></span>)}
            </button>
            <CSSTransition
                in={showList}
                timeout={100}
                classNames="fade w-full"
                unmountOnExit
                nodeRef={nodeRef}

            >

                <div className={twMerge(
                    "absolute  bg-white    z-10  w-[200px]  rounded-md overflow-hidden text-xs text-black -translate-x-3/4  shadow-sm  border border-[#cececede]  ",
                    dropdown ? "transform -translate-y-[100%] " : "top-[35px]"
                )}
                >
                    {languages.map((language, index) => {
                        return language.name !== lang.currentLanguage.name && (
                            <li className="cursor-pointer hover:bg-slate-100 border-b p-2 text-sm text-nowrap" onClick={() => handleToggleLanguage(language)}
                                key={index}>{language.name} {""} {`(${language.accroynm} )`}</li>)
                    })}
                </div>
            </CSSTransition>
        </div>
    );
};

export default ToggleLanguage