'use client';
import React from 'react';
import MeasurementForm from "@/app/_components/MeasurementForm";
import {useParams} from "next/navigation";
import {Id} from "../../../../../../convex/_generated/dataModel";

function Page() {
    const params = useParams<{ id: Id<'patients'> }>();
    return (
        <MeasurementForm patientId={params.id}/>
    );
}

export default Page;