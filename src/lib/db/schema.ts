import {
	timestamp,
	text,
	pgTable,
	uuid,
	boolean,
	integer,
	jsonb
} from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time').notNull(),
	location: jsonb('location'),
	backgroundStyle: jsonb('background_style').notNull(),
	isPublic: boolean('is_public').default(true),
	requireApproval: boolean('require_approval').default(false),
	capacity: integer('capacity'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
// export const events = pgTable('events', {
// 	id: uuid('id').defaultRandom().primaryKey(),
// 	name: text('name').notNull(),
// 	description: text('description'),
// 	startTime: timestamp('start_time').notNull(),
// 	endTime: timestamp('end_time').notNull(),
// 	location: jsonb('location').$type<{
// 		address: string;
// 		latitude?: number;
// 		longitude?: number;
// 	}>(),
// 	backgroundStyle: jsonb('background_style').$type<{
// 		type: 'solid' | 'gradient';
// 		colors: string[];
// 	}>(),
// 	isPublic: boolean('is_public').default(true),
// 	requireApproval: boolean('require_approval').default(false),
// 	capacity: integer('capacity'),
// 	createdAt: timestamp('created_at').defaultNow(),
// 	updatedAt: timestamp('updated_at').defaultNow()
// });
