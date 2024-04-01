import React, { ChangeEvent, useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PatientType } from "@/app/_components/SearchPatientResults";
import { PatientContext } from "../../../contexts/PatientContext";

export function SearchPatient() {
    const { state, dispatch } = useContext(PatientContext);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
    };

    // Fetch patients based on the current search term
    const fetchedPatients: PatientType[] = useQuery(api.patients.searchPatients, { name: state.searchTerm }) ?? [];

    // Memoize the fetched patients to avoid unnecessary re-renders
    const memoizedPatients = useMemo(() => fetchedPatients, [fetchedPatients]);

    // Update search results when patients data changes
    useEffect(() => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: memoizedPatients });
    }, [memoizedPatients, dispatch]);

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

export default SearchPatient;
