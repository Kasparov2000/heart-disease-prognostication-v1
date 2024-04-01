import React, { ChangeEvent, useRef, useEffect, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PatientType} from "@/app/_components/SearchPatientResults";
import {PatientContext} from "../../../contexts/PatientContext";


export function SearchPatient() {
    const { state, dispatch } = useContext(PatientContext);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
    };

    const patients: PatientType[] = useQuery(api.patients.searchPatients, { name: state.searchTerm }) ?? [];

    useEffect(() => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: patients });
    }, [patients, dispatch]);

    return (
        <div className={'relative flex justify-between gap-2'}>
            <div className="flex items-center p-2 gap-2">
                <Input
                    placeholder={'Search Patient ...'}
                    value={state.searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (!state.isSearching) {
                            dispatch({ type: 'TOGGLE_IS_SEARCHING', payload: true });
                        }
                    }}

                />
                <SearchIcon />
            </div>
        </div>
    );
}
