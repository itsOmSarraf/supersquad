import React from "react";
import { format } from "date-fns";
import { MapPin, Users, Globe, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventPreviewData } from "@/lib/types";

interface PreviewProps {
    data: EventPreviewData;
    className?: string;
}

export function EventPreview({ data, className }: PreviewProps) {
    const backgroundStyle =
        data.backgroundStyle.type === 'solid'
            ? { backgroundColor: data.backgroundStyle.colors[0] }
            : { backgroundImage: `linear-gradient(135deg, ${data.backgroundStyle.colors.join(', ')})` };

    // Calculate text color based on background brightness
    const getContrastColor = (color: string) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? 'black' : 'white';
    };

    const textColor = data.backgroundStyle.type === 'solid'
        ? getContrastColor(data.backgroundStyle.colors[0])
        : 'white';

    return (
        <div className={cn(
            "w-full rounded-lg shadow-lg overflow-hidden",
            className
        )}>
            {/* Header/Banner Section */}
            <div
                style={backgroundStyle}
                className="p-4 sm:p-8 relative"
            >
                <div className={cn(
                    "space-y-3 sm:space-y-4",
                    textColor === 'white' ? 'text-white' : 'text-black'
                )}>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {data.name || 'Event Name'}
                    </h1>

                    {data.description && (
                        <p className="text-sm opacity-90 line-clamp-2">
                            {data.description}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-x-4 text-sm">
                        <div className="flex items-center gap-x-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                                {format(data.startTime, "EEE, MMM d, yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                                {format(data.startTime, "h:mm a")} - {format(data.endTime, "h:mm a")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="bg-white p-4 sm:p-6 space-y-4">
                {data.location?.address && (
                    <div className="flex items-start gap-x-3">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-gray-500 truncate">
                                {data.location.address}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 sm:gap-x-6">
                    {data.capacity && (
                        <div className="flex items-center gap-x-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">{data.capacity}</p>
                                <p className="text-xs text-gray-500">Capacity</p>
                            </div>
                        </div>
                    )}

                    {data.isPublic !== undefined && data.isPublic !== null && (
                        <div className="flex items-center gap-x-2">
                            <Globe className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">
                                    {data.isPublic ? 'Public' : 'Private'}
                                </p>
                                <p className="text-xs text-gray-500">Visibility</p>
                            </div>
                        </div>
                    )}

                    {data.requireApproval && (
                        <div className="flex items-center gap-x-2">
                            <div className="text-sm text-gray-500">
                                Requires Approval
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function EventPreviewPage({ data }: PreviewProps) {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <EventPreview data={data} />
            </div>
        </div>
    );
}