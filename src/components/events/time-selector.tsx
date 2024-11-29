// src/components/events/time-selector.tsx
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeRange {
    startTime: Date;
    endTime: Date;
}

interface TimeSelectProps {
    value: TimeRange;
    onChange: (value: TimeRange) => void;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute of [0, 30]) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options.push(time);
        }
    }
    return options;
};

const TIME_OPTIONS = generateTimeOptions();

export function TimeSelector({ value, onChange }: TimeSelectProps) {
    const [startDate, setStartDate] = React.useState<Date>(value.startTime);
    const [endDate, setEndDate] = React.useState<Date>(value.endTime);

    const handleStartTimeChange = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(startDate);
        newDate.setHours(hours, minutes);
        setStartDate(newDate);
        onChange({ startTime: newDate, endTime: value.endTime });
    };

    const handleEndTimeChange = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(endDate);
        newDate.setHours(hours, minutes);
        setEndDate(newDate);
        onChange({ startTime: value.startTime, endTime: newDate });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Start Time Selector */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Start Time</label>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => {
                                    if (date) {
                                        const newDate = new Date(date);
                                        newDate.setHours(startDate.getHours(), startDate.getMinutes());
                                        setStartDate(newDate);
                                        onChange({ startTime: newDate, endTime: value.endTime });
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Select
                        value={format(startDate, "HH:mm")}
                        onValueChange={handleStartTimeChange}
                    >
                        <SelectTrigger className="w-[120px]">
                            <Clock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* End Time Selector */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">End Time</label>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[200px] justify-start text-left font-normal",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => {
                                    if (date) {
                                        const newDate = new Date(date);
                                        newDate.setHours(endDate.getHours(), endDate.getMinutes());
                                        setEndDate(newDate);
                                        onChange({ startTime: value.startTime, endTime: newDate });
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Select
                        value={format(endDate, "HH:mm")}
                        onValueChange={handleEndTimeChange}
                    >
                        <SelectTrigger className="w-[120px]">
                            <Clock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}