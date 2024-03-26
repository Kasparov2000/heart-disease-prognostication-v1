'use client';
import React from 'react';
import MeasurementForm from "@/app/_components/MeasurementForm";
import {useParams} from "next/navigation";

function Page() {
    const params = useParams<{ patientId: string;}>()
    return (
        <MeasurementForm patientId={patientId}/>
    );
}

export default Page;