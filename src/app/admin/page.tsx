import React from 'react';

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{value}</dd>
        </div>
    );
}

interface ApplicationReviewProps {
    formData: {
        name: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        state: string;
        postalCode: string;
        website: string;
        type: string;
        registrationNumber: string;
        taxId: string;
        accreditationDetails: string;
        authorizedContact: string;
        authorizedEmail: string;
        authorizedPhone: string;
        positionTitle: string;
    };
}

const formData = {
    name: "Sample Hospital",
    email: "samplehospital@example.com",
    phone: "+1234567890",
    country: "Sample Country",
    city: "Sample City",
    state: "Sample State",
    postalCode: "12345",
    website: "www.samplehospital.com",
    type: "Public Hospital",
    registrationNumber: "123456789",
    taxId: "987654321",
    accreditationDetails: "ISO 9001:2015",
    authorizedContact: "John Doe",
    authorizedEmail: "johndoe@example.com",
    authorizedPhone: "+1987654321",
    positionTitle: "Manager"
};
export default function ApplicationReviewComponent() {
    return (
        <div>
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    {Object.entries(formData).map(([k, v]) => (
                        <InfoItem key={k} label={k} value={v} />
                    ))}
                </dl>
            </div>
        </div>
    );
}
