"use client"

import MeasurementForm from "@/app/_components/MeasurementForm";

import {DataTable} from "@/app/_components/DataTable";
import {SearchPatient} from "@/app/_components/SearchPatient";

export default function DoctorDashboard () {
    return (
        <div className={'flex h-full overflow-y-scroll items-center'} >
            <div className={'w-[30%]'}>
                <SearchPatient/>
            </div>
            <div className={'lg:w-[70%] p-3 border-2 rounded-b-md bg-white'} >
                {/*<MeasurementForm/>*/}
                <DataTable/>
            </div>
        </div>
    )
}