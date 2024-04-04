import React, {createContext} from "react";
import {PatientType} from "@/app/_components/SearchPatientResults";

// State and action types
interface PatientState {
    currentPatient: PatientType | undefined;
    isSearching: boolean;
    searchResults: PatientType[];
    searchTerm: string;
    isLoading: boolean
}

type PatientAction =
    | { type: 'SET_CURRENT_PATIENT'; payload: PatientType | undefined }
    | { type: 'TOGGLE_IS_SEARCHING'; payload: boolean }
    | { type: 'SET_SEARCH_RESULTS'; payload: PatientType[] }
    | { type: 'SET_SEARCH_TERM'; payload: string }
    | { type: 'SET_IS_LOADING'; payload: boolean };

// Reducer function
export const patientReducer = (state: PatientState, action: PatientAction): PatientState => {
    switch (action.type) {
        case 'SET_CURRENT_PATIENT':
            return { ...state, currentPatient: action.payload };
        case 'TOGGLE_IS_SEARCHING':
            return { ...state, isSearching: action.payload };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        case 'SET_IS_LOADING':
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
};

export const initialState: PatientState = {
    currentPatient: undefined,
    isSearching: false,
    searchResults: [],
    searchTerm: '',
    isLoading: false
};
export const PatientContext = createContext<{
    state: PatientState;
    dispatch: React.Dispatch<PatientAction>;
}>({ state: initialState, dispatch: () => null })
