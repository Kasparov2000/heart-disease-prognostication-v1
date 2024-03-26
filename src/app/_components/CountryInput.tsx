import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import countries from "../../../lib/countries";

export function CountryInput(  {
    return (
    <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Email</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent sticky={'always'} className={'max-h-[40vh]'}>
                            <SelectGroup>
                                <SelectLabel>Countries</SelectLabel>
                                {countries.map((country) => (
                                    <SelectItem
                                        key={country.iso_code}
                                        value={country.iso_code}
                                    >
                                        {country.country}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
    );
}
