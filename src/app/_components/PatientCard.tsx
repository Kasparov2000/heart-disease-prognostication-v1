import Image from 'next/image';
import React from "react";
import {PatientType} from "@/app/_components/SearchPatientResults";
import ImageWithFallback from "@/app/_components/ImageWithFallback";

type PatientCardProps = {
    patient: PatientType;
};
export const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


const PatientCard: React.FC<PatientCardProps> = ({patient}) => {
    // Function to format full address
    const fullAddress = `${patient.city}, ${patient.state}, ${patient.country}`;

    return (
        <div className="flex flex-col p-2 justify-center items-center h-fit gap-6">
            {/* Profile Image */}
            <div className={'w-[200px] h-[133px] rounded-xl overflow-hidden'}>
                {
                    <image
                        href={patient.image ? patient.image : (patient.sex === 0 ? '/profile-pics-placeholder/female' : '/profile-pics-placeholder/male')}
                        className="object-fill"
                    />

                }
            </div>


            {/* Patient Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-600 font-bold">ID Number:</div>
                <div>{patient.idNumber}</div>

                <div className="text-gray-600 font-bold">Name:</div>
                <div>{patient.name}</div>

                <div className="text-gray-600 font-bold">Age:</div>
                <div>{calculateAge(patient.dob)} Years</div>

                <div className="text-gray-600 font-bold">Sex:</div>
                <div>{patient.sex === 1 ? "Male" : "Female"}</div>

                <div className="text-gray-600 font-bold">Address:</div>
                <div className="overflow-hidden overflow-ellipsis">{fullAddress}</div>
            </div>
        </div>
    );
};

export default PatientCard;
