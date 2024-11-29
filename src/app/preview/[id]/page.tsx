// src/app/preview/[id]/page.tsx
import { getEvent } from "@/actions/queries/event";
import { EventPreviewPage } from "@/components/events/preview";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
    params
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { success, data } = await getEvent(id);

    if (!success || !data) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: `${data.name} | Event Preview`,
        description: data.description || undefined,
    };
}

export default async function PreviewPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const searchParamsResolved = await searchParams;
    const { success, data } = await getEvent(id);

    if (!success || !data) {
        notFound();
    }
    //@ts-ignore
    return <EventPreviewPage data={data} />;
}