import React, {ChangeEvent, useCallback, useContext, useDeferredValue, useEffect, useRef} from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { PatientContext } from "../../../contexts/PatientContext";

export function SearchPatient() {
    const { state, dispatch } = useContext(PatientContext);
    const deferredSearchTerm = useDeferredValue(state.searchTerm);
    const queryResult = useQuery(api.patients.searchPatients, { name: deferredSearchTerm });
    useEffect(() => {
        if (queryResult) {
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: queryResult });
        }
    }, [queryResult, dispatch]);

    useEffect(() => {
        if (!queryResult && !state.isLoading) {
            dispatch({ type: 'SET_IS_LOADING', payload: true });
        } else if (queryResult && state.isLoading) {
            dispatch({ type: 'SET_IS_LOADING', payload: false });
        }
    }, [queryResult, state.isLoading, dispatch]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
    }, [dispatch]);

    return (
        <div className={'relative flex justify-between gap-2'}>
            <div className="flex items-center p-2 gap-2">
                <Input
                    placeholder={'Search Patient ...'}
                    value={state.searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => dispatch({ type: 'TOGGLE_IS_SEARCHING', payload: true })}
                />
            </div>
        </div>
    );
}

export default SearchPatient;
