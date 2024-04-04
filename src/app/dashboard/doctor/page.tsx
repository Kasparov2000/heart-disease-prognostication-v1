'use client';

import React, {ChangeEvent, createContext, FC, useCallback, useEffect, useReducer, useRef, useState} from 'react';
import PatientCard from "@/app/_components/PatientCard";
import {SearchPatient} from "@/app/_components/SearchPatient";
import AddPatient, {Patient} from "@/app/_components/AddPatient";
import {PatientType, SearchPatientResults} from "@/app/_components/SearchPatientResults";
import {DataTable} from "@/app/_components/DataTable";
import {useAuth, useUser} from "@clerk/nextjs";
import {useRouter, useSearchParams} from "next/navigation";
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import LoadingAnimation from "@/app/_components/Loading";
import MeasurementForm from "@/app/_components/MeasurementForm";
import {Id} from "../../../../convex/_generated/dataModel";
import {initialState, PatientContext, patientReducer} from "../../../../contexts/PatientContext";
import {CaretSortIcon, SwitchIcon} from "@radix-ui/react-icons";
import {IconButton} from "@radix-ui/themes";
import PatientCardSkeleton from "@/app/_components/PatientCardSkeleton";

export default function DoctorDashboard() {
    const searchParams = useSearchParams();
    const patientParams = useQuery(api.patients.getPatient, {patientId: searchParams.get('currentPatient') as Id<'patients'> ?? undefined});
    const {user: userClerk} = useUser();
    const userDb = useQuery(api.users.getMe, {userId: userClerk?.id ?? undefined});
    const router = useRouter();
    const [state, dispatch] = useReducer(patientReducer, initialState);
    const searchRef = useRef<HTMLDivElement>(null);
    const checkSubscription = useQuery(api.payments.checkSubscriptionStatus, {
        orgId: userDb?.orgId ?? undefined
    });

    useEffect(() => {
        if (patientParams) {
            dispatch({type: 'SET_CURRENT_PATIENT', payload: patientParams as PatientType});
        }
    }, [patientParams]);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
            dispatch({type: 'TOGGLE_IS_SEARCHING', payload: false});
        }
    }, [searchRef, dispatch]);

    const handleClickPatientProfileSwitch = useCallback(() => {
        dispatch({'type': 'TOGGLE_IS_SEARCHING', payload: !state.isSearching})
    }, [state.isSearching])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);


    if (!userClerk || !checkSubscription?.status) return <LoadingAnimation/>

    if (checkSubscription?.status === 'Expired' || checkSubscription?.status === 'NotFoundOrg') {
        return router.push(`/payment?orgId=${userDb?.orgId}`);
    }



    return (
        <PatientContext.Provider value={{state, dispatch}}>
            {
                checkSubscription?.planType === 'basic'
                    ?
                    <MeasurementForm/>
                    :
                    <div
                        className="flex h-[calc(100vh-4rem)] p-2 items-start overflow-hidden justify-around bg-gray-100">
                        {/* Left Panel */}
                        <div
                            className="w-[27%] flex flex-col h-full bg-white shadow-lg p-2 overflow-hidden overflow-y-scroll"
                            ref={searchRef}>
                            <div className={'mx-2 w-full'}>
                                <SearchPatient/>
                            </div>
                            <div className={'mx-2 p-2 flex justify-between'}>
                                <AddPatient/>
                                <IconButton size={'4'} className={'mr-2'} onClick={handleClickPatientProfileSwitch}>
                                    <CaretSortIcon/>
                                </IconButton>

                            </div>
                            <div className="p-1 w-full h-full overflow-hidden overflow-y-scroll">
                                {
                                    state.isSearching
                                        ?
                                        <SearchPatientResults/>
                                        :
                                    state.currentPatient
                                        ?
                                        <PatientCard patient={state.currentPatient} />
                                        :
                                        <PatientCardSkeleton/>
                                }
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="w-[70%] h-full p-3 border-2 rounded-b-md bg-white shadow-md">
                            {state.currentPatient && userDb && <DataTable orgId={userDb.orgId}  patientId={state.currentPatient._id}/>}
                        </div>
                    </div>
            }
        </PatientContext.Provider>
    );
}
