
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type SelectComboboxItemType = {
    id: number | string;
    value: string,
}

type SelectComboboxProps = {
    label?: string,
    placeholder?: string,
    items: SelectComboboxItemType[],
    currentItem?: SelectComboboxItemType | undefined,
    onChange?: (newValue: SelectComboboxItemType | undefined) => void
}

export function SelectCombobox(
    {
        items,
        currentItem = undefined,
        onChange,
        placeholder = 'Select an item',
    }: SelectComboboxProps
) {
    const [open, setOpen] = useState(false);

    const handleOnChangeItem = (newValue: SelectComboboxItemType) => {
        // If selecting the same newValidationLevel, pass null (to deselect)
        const newSelection = newValue && newValue?.id === currentItem?.id ? undefined : newValue;

        // Call the parent component's onChange handler
        if (onChange) {
            onChange(newSelection);
        }
        setOpen(false);
    };

    const { t } = useTranslation();
    const translationKey = 'module.payment.validator.component.validation_level_combobox_select';
    const translate = (key: string) => {
        return t(`${translationKey}.${key}`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" justify-between w-full"
                >
                    {currentItem
                        ? items?.find((obj) => obj.id === currentItem.id)?.value
                        : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent   >
                <Command className="pointer-events-auto" >
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList >
                        <CommandEmpty>{translate('no_data')}</CommandEmpty>
                        <CommandGroup className="">
                            {items && items?.map((obj) => (
                                <CommandItem
                                    key={`${obj.id}-item`}
                                    value={String(obj.value)}
                                    onSelect={(currentValue) => {
                                        const currentSection = items?.find((obj) => obj.value === currentValue)
                                        if (currentSection) {
                                            handleOnChangeItem(currentSection)
                                        }
                                        setOpen(false)
                                    }}
                                >
                                    {obj.value}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            currentItem?.id === obj.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
