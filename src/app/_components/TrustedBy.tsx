import React from 'react';
import Image from "next/image";

function TrustedBy() {
    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">Trusted by the world’s top hospitals</h2>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                    <image className="col-span-2 max-h-25 w-full object-contain lg:col-span-1" href="/king_faisal_logo.jpeg" width="158" height="48"/>
                    <image className="col-span-2 object-contain lg:col-span-1" href="/mayo_clinic.jpeg" width="158" height="48"/>
                </div>
            </div>
        </div>
    );
}

export default TrustedBy;