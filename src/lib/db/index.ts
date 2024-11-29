// src/lib/db/index.ts
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		//require: true,
		rejectUnauthorized: true
	}
});

export const db = drizzle(pool, { schema });
