import {Doc, Id} from "../../../convex/_generated/dataModel";
import {jsPDF} from "jspdf";
import React from "react";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Button} from "@/components/ui/button";
import {DownloadIcon} from "@radix-ui/react-icons";
import autoTable from "jspdf-autotable";

interface ReportParams {
    data: Doc<'records'>;
    patientDetails: Doc<'patients'> ;
    doctorDetails: Doc<'doctors'>;
    hospitalDetails: Doc<'hospitals'>;
}



// private fields that should not be included in the PDF
const PRIVATE_FIELDS = ['_creationTime', '_id', 'orgId', 'doctorId', 'patientId'];

function downloadPDF(params: ReportParams) {
    const doc = new jsPDF();
    const patientName = params.patientDetails.name || 'Patient';
    const filename = `${patientName.replace(/\s+/g, '_')}-medical-report.pdf`;

    // Header
    doc.setFontSize(16);
    doc.text('Medical Report', 10, 10);
    doc.setFontSize(12);

    // Concatenate address details
    const hospitalAddress = [params.hospitalDetails.city, params.hospitalDetails.state, params.hospitalDetails.country, params.hospitalDetails.postalCode].filter(Boolean).join(', ');

    // Hospital Details
    doc.text('Hospital Details:', 10, 20);
    doc.text(`Name: ${params.hospitalDetails.name}`, 10, 30);
    doc.text(`Address: ${hospitalAddress}`, 10, 40);

    // Doctor Details
    doc.text('Doctor Details:', 10, 50);
    doc.text(`Name: ${params.doctorDetails.name}`, 10, 60);
    doc.text(`Specialty: ${params.doctorDetails.specialization}`, 10, 70);
    doc.text(`Contact: ${params.doctorDetails.phone}`, 10, 80);

    // Patient Details
    doc.text('Patient Details:', 10, 90);
    doc.text(`Name: ${params.patientDetails.name}`, 10, 100);
    doc.text(`DOB: ${params.patientDetails.dob}`, 10, 110);
    doc.text(`ID: ${params.patientDetails.idNumber}`, 10, 120);
    doc.text(`Phone: ${params.patientDetails.phone}`, 10, 130);

    // Recordings Data
    doc.text('Recordings Data:', 10, 140);
    const applicationTableData = Object.entries(params.data)
        .filter(([key]) => !PRIVATE_FIELDS.includes(key))
        .map(([key, value]) => [key, value.toString()]);

    autoTable(doc, {
        startY: 150,
        head: [['Field', 'Value']],
        body: applicationTableData,
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 30 }
    });

    // Risk Assessment
    const startY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Risk Assessment:', 10, startY);
    doc.text(`Risk Level: ${params.data.risk}`, 10, startY + 10);

    // Save PDF
    doc.save(filename);
}


// Helper function to format camelCase to human-readable string
function splitCamelCaseAndCapitalize(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
}

export const DownloadMedicalReport: React.FC<{ recordId: Id<'records'> }> = ({ recordId }) => {

    const record = useQuery(api.records.getPatientRecord, {recordId})
    const doctorDetails = useQuery(api.doctors.getDoctor, {doctorId: record?.doctorId ?? undefined})
    const hospitalDetails = useQuery(api.hospitals.getHospital, {orgId: record?.orgId ?? undefined})
    const patientDetails = useQuery(api.patients.getPatient, {patientId: record?.patientId ?? undefined})

    const isReportValid = record && doctorDetails && hospitalDetails && patientDetails
    console.log({record, doctorDetails, hospitalDetails, patientDetails})
    const handleDownload = () => {
        if (isReportValid)
            downloadPDF({
                data: record,
                hospitalDetails: hospitalDetails,
                doctorDetails: doctorDetails,
                patientDetails: patientDetails
            });
    };

    return (
        <Button disabled={!isReportValid} variant={'outline'} className={'ml-auto mr-2'} onClick={handleDownload}>
            <span>Download Medical Report</span>
            <DownloadIcon  className={'ml-2 blue-100'}/>
        </Button>
    );
};