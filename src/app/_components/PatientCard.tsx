import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import React from "react";
import { Patient } from "@/app/dashboard/doctor/page"; // Adjust this import based on your file structure

type PatientCardProps = {
    patient: Patient;
};

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
    // Function to calculate age from date of birth
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    console.log(
        {patient}
    )

    // Function to format full address
    const fullAddress = `${patient.city}, ${patient.state}, ${patient.country}`;

    return (
        <div className="flex flex-col justify-center gap-6">
            {/* Profile Image */}
            {   patient.image &&
                <Image
                src={patient.image} // Dynamic image source
                alt='Patient'
                width={200}
                height={200}
                style={{objectFit: "contain"}}
                className="rounded-xl"
            />}

            {/* Patient Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-600 font-bold">ID Number:</div>
                <div>{patient.idNumber}</div>

                <div className="text-gray-600 font-bold">Name:</div>
                <div>{patient.name}</div>

                <div className="text-gray-600 font-bold">Age:</div>
                <div>{calculateAge(patient.dob)} Years</div>

                <div className="text-gray-600 font-bold">Address:</div>
                <div className="overflow-hidden overflow-ellipsis">{fullAddress}</div>

                <div className="text-gray-600 font-bold">Risk:</div>
                <Badge variant="outline" color={patient.riskLevel === 'Low' ? 'green' : patient.riskLevel === 'Medium' ? 'yellow' : 'red'}>
                    {patient.riskLevel}
                </Badge>
            </div>
        </div>
    );
};

export default PatientCard;
