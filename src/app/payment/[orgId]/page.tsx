'use client';
import {PaymentMethod} from "@/app/_components/PaymentMethod";
import {useParams} from "next/navigation";

function Page() {
    const params = useParams<{orgId: string}>()
    return (
        <div className={'w-[400px] m-auto'}>
            <PaymentMethod orgId={params.orgId}/>
        </div>
    );
}

export default Page;