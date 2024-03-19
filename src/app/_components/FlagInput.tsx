import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import * as React from "react";

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];
    return (
        <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};

FlagComponent.displayName = "FlagComponent";

export default  FlagComponent