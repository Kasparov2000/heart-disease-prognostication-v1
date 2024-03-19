import React from 'react';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

function PlanFeatures({ features }: { features: string[] }) {
    return (
        <ul className="flex  flex-wrap gap-2 text-gray-500">
            {features.map((feature, idx) => (
                <li className="flex items-center w-[325px] h-[24px] "  key={idx}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="rgba(79, 70, 229, .9)" aria-hidden="true" className="w-[1.25rem] h-[1.5rem] mr-3">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                    </svg>
                    <span className="flex-shrink-0 text-[0.875rem]">{feature}</span>
                </li>
            ))}
        </ul>
    );
}

function PricingPlans() {
    const basicFeatures = ["Access for 5 doctors", "Basic heart disease prediction", "Email support"];
    const standardFeatures = ["Access for 20 doctors", "Patient data storage (up to 5000 records)", "Limited data analytics", "Full support"];
    const premiumFeatures = ["Unlimited access for doctors", "Patient data storage (unlimited)", "Data analytics","Integration EHR systems"];


    return (
        <div className={'min-h-h-[calc(100vh-4rem)] mt-5'}>
            <div className={'p-5 text-center'}>
                <h2 className={'text-blue-900 font-semibold tracking-wide'}>Pricing</h2>
                <p className={'text-[2.5rem] md:text-[3.5rem] font-[600]'}>Pricing plans for teams of all sizes</p>
            </div>
            <div className={'w-full p-5  flex flex-col items-center justify-center lg:flex-row lg:items-end'}>
                <div className={" bg-white flex flex-col justify-center gap-3.5  border-r-[0] border-solid border-[1px] border-gray-200 w-[405px] h-[512px] mb-2 rounded-[1.5rem] lg:rounded-[0rem] lg:rounded-l-[1.5rem] p-[2.5rem]"}>
                    <h3 className={'font-[700] tracking-wide'}>Basic</h3>
                    <p className={'text-gray-500'}>Essential features for small practices</p>
                    <p className={'p'}>
                        <span className={'text-[2.5rem] font-bold'}>$499</span>
                        <span>/month</span>
                    </p>
                    <PlanFeatures features={basicFeatures} />
                    <Button variant={'outline'} color={'purple'} className={'mt-auto text-blue-600'}>
                        <span className={'text-[rgb(99 102 241)]'}>Buy Plan</span>
                    </Button>
                </div>
                <div className={"flex bg-white flex-col gap-3.5 border-solid border-[1px] pricing:bg-red-100 border-gray-200 w-[405px] h-[544px] mb-2 rounded-[1.5rem] lg:rounded-[0rem] lg:rounded-t-[1.5rem] p-[2.5rem]"}>
                    <div className={'flex justify-between'}>
                        <h3 className={'font-[700] tracking-wide text-blue-700'}>Standard</h3>
                        <Badge className={'bg-blue-50 text-blue-700'}>Most Popular</Badge>
                    </div>
                    <p className={'text-gray-500'}>Enhanced features for mid-sized practices</p>
                    <p className={'p'}>
                        <span className={'text-[2.5rem] font-bold mt-auto'}>$999</span>
                        <span>/month</span>
                    </p>
                    <PlanFeatures features={standardFeatures} />
                    <Button variant={'outline'} className={'mt-auto bg-blue-600 text-white'}>
                        Buy Plan
                    </Button>
                </div>
                <div className={"flex bg-white flex-col gap-3.5 border-l-[0] border-solid border-[1px] border-gray-200 w-[405px] h-[512px] mb-2 rounded-[1.5rem] lg:rounded-[0rem] lg:rounded-r-[1.5rem] p-[2.5rem]"}>
                    <h3 className={'font-[700] tracking-wide'}>Premium</h3>
                    <p className={'text-gray-500'}>Comprehensive features for large practices</p>
                    <p className={'p'}>
                        <span className={'text-[2.5rem] font-bold'}>$2999</span>
                        <span>/month</span>
                    </p>
                    <PlanFeatures features={premiumFeatures} />
                    <Button variant={'outline'} className={'text-blue-600 mt-auto'}>
                        <span>Buy Plan</span>
                    </Button>
                </div>

            </div>
        </div>
    );
}

export default PricingPlans;
