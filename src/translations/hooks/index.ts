import { RootState, useAppDispatch, useAppSelector } from "@/redux.config";

export const useTranslateLanguage = () => {
    const lang = useAppSelector((state: RootState) => state?.lang);
    const dispatch = useAppDispatch();

    // Define any additional actions or selectors related to auth if needed

    return { lang, dispatch };
};