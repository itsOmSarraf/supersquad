import { type InferModel } from 'drizzle-orm';
import { events } from '@/lib/db/schema';

export type Event = InferModel<typeof events>;
export type NewEvent = InferModel<typeof events, 'insert'>;
export type EventPreviewData = {
	name: string;
	description?: string | null;
	startTime: Date;
	endTime: Date;
	location?: {
		address: string;
		latitude?: number;
		longitude?: number;
	};
	backgroundStyle: {
		type: 'solid' | 'gradient';
		colors: string[];
	};
	isPublic?: boolean;
	requireApproval?: boolean;
	capacity?: number;
};
