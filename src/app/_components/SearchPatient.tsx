import React, { ChangeEvent, useContext, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { PatientContext } from "../../../contexts/PatientContext";

export function SearchPatient() {
    const { state, dispatch } = useContext(PatientContext);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
    };

    // Fetch patients based on the current search term
    const fetchedPatients = useQuery(api.patients.searchPatients, { name: state.searchTerm }) ?? [];

    // Update search results when patients data changes
    useEffect(() => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: fetchedPatients });
    }, [fetchedPatients, dispatch]);

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
            </div>
        </div>
    );
}

export default SearchPatient;
