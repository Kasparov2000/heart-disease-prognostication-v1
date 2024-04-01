import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingAnimation() {
    return (
        <div className="fixed w-full h-full  inset-0 flex justify-center items-center">
            <Loader2 className="animate-spin h-10 w-10 animate-spin" />
        </div>
    );
}
