import * as React from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input, InputProps } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import FlagComponent from '@/app/_components/FlagInput';

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> &
    Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    onError?: (error: string) => void;
};

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    return <Input className={cn('rounded-s-none rounded-e-lg', className)} {...props} ref={ref} />;
});
InputComponent.displayName = 'InputComponent';

const PhoneInput = React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, onError, ...props }, ref) => {
        const handleChange = (value: RPNInput.Value) => {
            if (value) {
                onChange?.(value);
            } else {
                onError?.('Invalid phone number');
            }
        };

        return (
            <RPNInput.default
                ref={ref}
                className={cn('flex', className)}
                flagComponent={FlagComponent}
                countrySelectComponent={CountryCodeSelect}
                inputComponent={InputComponent}
                onChange={handleChange}
                {...props}
            />
        );
    }
);
PhoneInput.displayName = 'PhoneInput';

type CountryCodeSelectOption = { label: string; value: RPNInput.Country };
type CountryCodeSelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    onChange: (value: RPNInput.Country) => void;
    options: CountryCodeSelectOption[];
};

const CountryCodeSelect = ({ disabled, value, onChange, options }: CountryCodeSelectProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type='button' variant='outline' className={cn('flex gap-1 rounded-e-none rounded-s-lg pr-1 pl-3')} disabled={disabled}>
                    <FlagComponent country={value} countryName={value} />
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 w-[200px]'>
                <Command>
                    <CommandInput placeholder='Search country...' className='h-9' />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {options.filter((x) => x.value).map((option) => (
                                <CommandItem key={option.value} className='gap-2' onSelect={() => onChange(option.value)}>
                                    <FlagComponent country={option.value} countryName={option.label} />
                                    <span className='text-sm flex-1'>{option.label}</span>
                                    {option.value && <span className='text-sm text-foreground/50'>{`+${RPNInput.getCountryCallingCode(option.value)}`}</span>}
                                    <CheckIcon className={cn('ml-auto h-4 w-4', option.value === value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export { PhoneInput };
