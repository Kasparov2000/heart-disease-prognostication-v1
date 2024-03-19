import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import FlagComponent from "./FlagInput";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {CheckIcon} from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import countries from "../../../Lib/countries";


interface Country  {
    iso_code: string,
    country: string
}
type CountrySelectProps = {
    countries: Country[];
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    options: {label: string; value: string};
};


function CountryInput({options, value, onChange, disabled}:CountrySelectProps) {
    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={cn("flex w-1/4 justify-start rounded-s-lg pr-3 pl-3")} disabled={disabled}>
                    <FlagComponent country={value} countryName={value}/>
                    <span className={'ml-2'}>
                        {value
                            ? countries.find((country) => country.iso_code === value)?.country
                            : "Select country..."}
                    </span>
                    <CaretSortIcon className="h-4 w-4 shrink-0 ml-auto  opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search country..." className="h-9" />
                    <CommandEmpty>No country found</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {countries.filter((x) => x.iso_code).map((country) => (
                                <CommandItem key={country.iso_code} className="gap-2" onSelect={() => onChange(country.iso_code)}>
                                    <FlagComponent country={country.iso_code} countryName={country.country} />
                                    <span className="text-sm flex-1">{country.country}</span>
                                    <CheckIcon className={cn("ml-auto h-4 w-4", country.iso_code === value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default CountryInput;