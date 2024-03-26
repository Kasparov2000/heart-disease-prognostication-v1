import React, {useState, ChangeEvent, useRef, useEffect} from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Patient } from "@/app/_components/AddPatient";
import {PatientWithDBFields} from "@/app/_components/SearchPatientResults";

interface SearchPatientProps {
    setIsSearching: (isSearching: boolean) => void
    setSearchResults: (patients: PatientWithDBFields[]) => void
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void;
}



export function SearchPatient({ setIsSearching, setSearchResults, searchTerm, setSearchTerm }: SearchPatientProps) {
    const inputRef = useRef(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const patients: PatientWithDBFields[] = useQuery(api.patients.searchPatients, { name: searchTerm }) ?? [];

    useEffect(() => {
        setSearchResults(patients)
    }, [patients]);

    return (
        <div className={'relative flex justify-between gap-2'}>
            <div className="flex items-center p-2 gap-2">
                <Input
                    ref={inputRef}
                    placeholder={'Search Patient ...'}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsSearching(true)}
                />
                <SearchIcon />
            </div>
        </div>
    );
}
