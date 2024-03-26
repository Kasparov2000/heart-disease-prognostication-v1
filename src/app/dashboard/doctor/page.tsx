'use client';

import React, {FC, useEffect, useState} from 'react';
import PatientCard from "@/app/_components/PatientCard";
import {SearchPatient} from "@/app/_components/SearchPatient";
import AddPatient, {Patient} from "@/app/_components/AddPatient";
import {PatientWithDBFields, SearchPatientResults} from "@/app/_components/SearchPatientResults";
import {DataTable} from "@/app/_components/DataTable";


export default function DoctorDashboard() {
    const [currentPatient, setCurrentPatient] = useState<PatientWithDBFields | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<PatientWithDBFields[]>([])
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex h-[calc(100vh-4rem)] p-2 items-start overflow-hidden justify-around bg-gray-100">
            {/* Left Panel */}
            <div className="w-[27%] flex flex-col h-full bg-white shadow-lg p-2 overflow-hidden overflow-y-scroll">
                <div className={'mx-2 w-full'}>
                    <SearchPatient setSearchResults={setSearchResults} setIsSearching={setIsSearching} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </div>
                <div className={'mx-2 p-2'}>
                    <AddPatient/>
                </div>
                <div className="p-1 w-full h-full overflow-hidden overflow-y-scroll">
                    {
                        isSearching
                            ?
                            <SearchPatientResults setIsSearching={setIsSearching} searchTerm={searchTerm} isSearching={isSearching} patients={searchResults} setCurrentPatient={setCurrentPatient}/>
                            :
                        currentPatient ? <PatientCard patient={currentPatient} /> : null
                    }
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-[70%] h-full p-3 border-2 rounded-b-md bg-white shadow-md">
                {currentPatient && <DataTable patientId={currentPatient._id} />}
            </div>
        </div>
    );
}

