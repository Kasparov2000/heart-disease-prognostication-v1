import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Id} from "../../../convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useCallback} from "react";
import {DownloadMedicalReport} from "@/app/_components/DownloadMedicalReport";

export default function PredictionResult({open, setOpen, patientId, risk, recordId}: {
    open: boolean,
    patientId?: Id<'patients'>
    recordId?: Id<'records'>
    risk: number,
    setOpen: (arg: boolean) => void
}) {
    const router = useRouter();
    const patient = useQuery(api.patients.getPatient, {patientId})
    const riskLevel = risk > 0.7 ? 'high' : risk > 0.3 ? 'moderate' : 'low';
    const riskColor = riskLevel === 'high' ? 'text-red-600' : riskLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600';
    const handleClick = useCallback(() => {
        setOpen(false)
        if (patientId) {
            return router.push(`/dashboard/doctor/?currentPatient=${patientId}`)
        }
    }, [open, patientId, router, setOpen])

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className='bg-white p-4 shadow-md rounded-lg'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center text-lg font-bold'>Patient Risk
                        Assessment</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className='mt-4'>
                    <div className='text-center'>
                        <h3 className='font-semibold mb-2'>Heart Disease Prediction</h3>
                        <p>The predicted risk for patient {patient?.name &&
                            <span className='font-semibold'>: {patient.name}</span>} is:</p>
                        <div className={`text-2xl font-bold ${riskColor} mt-2`}>
                            {riskLevel.toUpperCase()} RISK ({risk.toFixed(2)}%)
                        </div>
                        {
                            patientId && recordId
                                ?
                                <>
                                    <p className='mt-4 text-sm text-gray-600'>Please review the patient&apos;s profile for
                                        detailed information and suggested actions.</p>
                                    <DownloadMedicalReport recordId={recordId}/>
                                </>

                                : null
                        }

                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter className='flex justify-center mt-4'>
                    {
                        patientId
                            ?
                            <Button
                                className='bg-blue-500 text-white hover:bg-blue-600'
                                onClick={handleClick}
                            >
                                Review Patient Profile
                            </Button>
                            :
                            <Button
                                className='mr-5 bg-blue-500 text-white hover:bg-blue-600'
                                onClick={handleClick}
                            >
                                Done
                            </Button>
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
