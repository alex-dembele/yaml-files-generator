import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import languages from "../languages";
import { useTranslateLanguage } from "../hooks";
import { toggleLanguage } from "../redux";
import ReactCountryFlag from "react-country-flag"

export type ToggleLanguageProps = {
    color?: string;
    rounded?: boolean;
    dropdown?: boolean
};

export const ToggleLanguage: FC<ToggleLanguageProps> = ({ color, rounded = false }) => {
    const { lang, dispatch } = useTranslateLanguage();
    const { i18n } = useTranslation();

    const handleToggleLanguage = (selectedLanguage: ILangauge) => {
        i18n.changeLanguage(selectedLanguage.key);
        dispatch(toggleLanguage(selectedLanguage));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={twMerge(
                    "py-2 px-2 text-left text-sm text-dark w-full flex items-center justify-between gap-1 mr-2",
                    rounded ? "rounded-lg" : "rounded-sm",
                    "bg-slate-200 hover:bg-slate-300 transition-colors"
                )}
                style={{ background: color }}
            >
                <div className="flex items-center gap-2">
                    <ReactCountryFlag
                        countryCode={lang.currentLanguage.countryCode}
                        svg
                        style={{ width: '1em', height: '1em' }}
                    />
                    <span className="block truncate text-sm lg:text-[0.9em]">
                        {lang.currentLanguage.accroynm}
                    </span>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[200px] rounded-md bg-white border border-[#cececede]"
            >
                {languages.map((language, index) => (
                    language.name !== lang.currentLanguage.name && (
                        <DropdownMenuItem
                            key={index}
                            className="cursor-pointer hover:bg-slate-100 p-2 text-sm text-nowrap flex items-center gap-2"
                            onClick={() => handleToggleLanguage(language)}
                        >
                            <ReactCountryFlag
                                countryCode={language.countryCode}
                                svg
                                style={{ width: '1em', height: '1em' }}
                            />
                            <span>{language.accroynm}</span>
                        </DropdownMenuItem>
                    )
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ToggleLanguage;