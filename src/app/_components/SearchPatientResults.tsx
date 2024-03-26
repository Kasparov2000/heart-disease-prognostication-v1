import React, {FC, useCallback} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import getExtremeInitials from "../../../lib/getExtremeIntials";
import {Loader2} from "lucide-react";
import {Patient} from "@/app/_components/AddPatient";

export type PatientWithDBFields = (Patient & {image: string, _id: string})
interface SearchPatientResultProps {
    patients: PatientWithDBFields[] ;
    setCurrentPatient: (patient: PatientWithDBFields) => void;
    isSearching: boolean
    setIsSearching: (isSearching: boolean) => void
    searchTerm: string
}

export const SearchPatientResults: FC<SearchPatientResultProps> = ({ isSearching, setIsSearching, searchTerm, patients, setCurrentPatient}) => {
    const handleClick = useCallback((patient: PatientWithDBFields) => {
        setIsSearching(false);
        setCurrentPatient(patient);
    }, [setIsSearching, setCurrentPatient])

    return (
        <div className={'w-full h-full p-2 overflow-y-scroll'}>
            {
                patients.length === 0
                ?
                    (
                        isSearching && searchTerm
                        ?
                        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                        :
                        <p className={'text-center'}>No results...</p>
                    )
                :

                <ul role={'list'} className="p-2 divide-slate-400 divide-y">
                    {patients.map(patient => (
                        <li key={patient._id} onClick={() => handleClick(patient)} className={'py-4 gap-2 flex flex-row px-2 hover:cursor-pointer hover:bg-violet-100 active:bg-violet-200'}>
                            <Avatar>
                                <AvatarImage src={patient.image} />
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
