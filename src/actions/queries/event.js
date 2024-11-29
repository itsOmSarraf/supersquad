import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createEvent(eventData) {
	try {
		console.log('Raw event data:', JSON.stringify(eventData, null, 2));

		// Validate required fields
		if (!eventData.name) {
			throw new Error('Event name is required');
		}
		if (!eventData.startTime) {
			throw new Error('Start time is required');
		}
		if (!eventData.endTime) {
			throw new Error('End time is required');
		}

		// Check if backgroundStyle is properly formatted
		if (!eventData.backgroundStyle?.colors || !eventData.backgroundStyle.type) {
			console.error('Background style error:', eventData.backgroundStyle);
			throw new Error('Invalid background style format');
		}

		// Ensure dates are Date objects
		const formattedData = {
			...eventData,
			startTime: new Date(eventData.startTime),
			endTime: new Date(eventData.endTime),
			// Convert any undefined values to null for PostgreSQL
			description: eventData.description || null,
			location: eventData.location || null,
			capacity: eventData.capacity || null,
			// Ensure backgroundStyle is properly formatted
			backgroundStyle: {
				type: eventData.backgroundStyle.type,
				colors: eventData.backgroundStyle.colors
			}
		};

		console.log(
			'Formatted data for database:',
			JSON.stringify(formattedData, null, 2)
		);

		const [newEvent] = await db
			.insert(events)
			.values(formattedData)
			.returning();

		console.log('Successfully created event:', newEvent);
		return { success: true, data: newEvent };
	} catch (error) {
		console.error('Detailed error creating event:', {
			error,
			errorMessage: error instanceof Error ? error.message : 'Unknown error',
			errorStack: error instanceof Error ? error.stack : undefined,
			errorType: error instanceof Error ? error.constructor.name : typeof error
		});
		return { success: false, error };
	}
}
export async function getEvent(id) {
	try {
		const [event] = await db.select().from(events).where(eq(events.id, id));

		if (!event) {
			return { success: false, error: 'Event not found' };
		}

		return { success: true, data: event };
	} catch (error) {
		console.error('Error fetching event:', error);
		return { success: false, error };
	}
}

export async function getAllEvents() {
	try {
		const allEvents = await db.select().from(events).orderBy(events.createdAt);

		return { success: true, data: allEvents };
	} catch (error) {
		console.error('Error fetching events:', error);
		return { success: false, error };
	}
}
