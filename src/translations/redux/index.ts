import { createSlice } from '@reduxjs/toolkit';
import languages from '../languages';

export interface LanguageTranslateState {
    currentLanguage: ILangauge

};

const initialState: LanguageTranslateState = {
    currentLanguage: languages[1] // french is the default
};

const languageSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        toggleLanguage: (state, action) => {
            state.currentLanguage = action.payload
        }
    },

})


export const { toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;

