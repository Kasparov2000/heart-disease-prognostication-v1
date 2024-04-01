import React, {createContext} from "react";
import {initialState} from "./PatientContext";

export const PatientContext = createContext<{
    state: PatientState;
    dispatch: React.Dispatch<PatientAction>;
}>({ state: initialState, dispatch: () => null })
