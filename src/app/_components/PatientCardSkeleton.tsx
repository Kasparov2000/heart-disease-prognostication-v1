import React from 'react';

function PatientCardSkeleton() {
    return (
        <div className="flex flex-col p-2 justify-center items-center h-fit gap-6 w-full">
            {/* Profile Image Skeleton */}
            <div className="w-[200px] h-[133px] rounded-xl overflow-hidden bg-gray-300 animate-pulse">
                {/* Empty div for simulating image */}
            </div>

            {/* Patient Details Skeleton */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                {/* ID Number Skeleton */}
                <div className="text-gray-600 font-bold">ID Number:</div>
                <div className="h-4 bg-gray-300 rounded-md w-full animate-pulse"></div>

                {/* Name Skeleton */}
                <div className="text-gray-600 font-bold">Name:</div>
                <div className="h-4 bg-gray-300 rounded-md w-full animate-pulse"></div>

                {/* Age Skeleton */}
                <div className="text-gray-600 font-bold">Age:</div>
                <div className="h-4 bg-gray-300 rounded-md w-full animate-pulse"></div>

                {/* Address Skeleton */}
                <div className="text-gray-600 font-bold">Address:</div>
                <div className="h-4 bg-gray-300 rounded-md w-full animate-pulse"></div>
            </div>
        </div>

    );
}

export default PatientCardSkeleton;