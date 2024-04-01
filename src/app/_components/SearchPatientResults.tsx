import React, { FC, useCallback, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getExtremeInitials from "../../../Lib/getExtremeIntials";
import { Loader2 } from "lucide-react";

import {Doc} from "../../../convex/_generated/dataModel";
import {PatientContext} from "../../../contexts/PatientContext";

export type PatientType= (Doc<'patients'> & {image: string | null})
export const SearchPatientResults: FC = () => {
    const { state, dispatch } = useContext(PatientContext);

    const handleClick = useCallback((patient: PatientType) => {
        dispatch({ type: 'TOGGLE_IS_SEARCHING', payload: false });
        dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient });
    }, [dispatch]);

    return (
        <div className={'w-full h-full p-2 overflow-y-scroll'}>
            {
                state.searchResults.length === 0
                    ?
                    (
                        state.isSearching && state.searchTerm
                            ?
                            <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                            :
                            <p className={'text-center'}>No results...</p>
                    )
                    :

                    <ul role={'list'} className="p-2 divide-slate-400 divide-y">
                        {state.searchResults.map(patient => (
                            <li key={patient._id} onClick={() => handleClick(patient)} className={'py-4 gap-2 flex flex-row px-2 hover:cursor-pointer hover:bg-violet-100 active:bg-violet-200'}>
                                <Avatar>
                                    <AvatarImage src={patient.image ?? undefined} />
                                    <AvatarFallback>{getExtremeInitials(patient.name)}</AvatarFallback>
                                </Avatar>
                                <div className={'w-[85%]'}>
                                    <p className={'text-sm truncate font-medium text-slate-900'}>{patient.name}</p>
                                    <p className={'text-sm text-slate-500 truncate'}>{patient.idNumber}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

            }
        </div>
    );
}
