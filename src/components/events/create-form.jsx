// src/components/events/create-form.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from './color-picker';
import { TimeSelector } from './time-selector';
import { LocationInput } from './location-input';
import { EventPreview } from './preview';
import { createEvent } from '@/actions/queries/event';

const formSchema = z.object({
	name: z.string().min(1, 'Event name is required'),
	description: z.string().optional().nullable(),
	startTime: z.date(),
	endTime: z.date(),
	location: z
		.object({
			address: z.string(),
			latitude: z.number().optional(),
			longitude: z.number().optional()
		})
		.nullable()
		.optional(),
	backgroundStyle: z.object({
		type: z.enum(['solid', 'gradient']),
		colors: z.array(z.string())
	}),
	isPublic: z.boolean(),
	requireApproval: z.boolean(),
	capacity: z.number().int().positive().nullable().optional()
});

const defaultValues = {
	name: '',
	description: '',
	startTime: new Date(),
	endTime: new Date(Date.now() + 3600000),
	backgroundStyle: {
		type: 'solid',
		colors: ['#FF5733']
	},
	isPublic: true,
	requireApproval: false,
	capacity: null,
	location: null
};

export function CreateEventForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange'
	});

	const onSubmit = async (values) => {
		try {
			setIsSubmitting(true);
			console.log('Submitting form with values:', values);

			const result = await createEvent(values);
			console.log('Create event result:', result);

			if (result.success) {
				router.push(`/preview/${result.data.id}`);
			} else {
				console.error('Failed to create event:', result.error);
				alert('Failed to create event. Please try again.');
			}
		} catch (error) {
			console.error('Error in form submission:', error);
			alert('An error occurred. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex flex-col lg:flex-row gap-8 p-4 sm:p-6'>
			{/* Form Section */}
			<div className='w-full lg:w-1/2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6 sm:space-y-8'>
						{/* Name Field */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Name</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter event name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description Field */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Describe your event'
											className='resize-none min-h-[100px]'
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Background Style Field */}
						<FormField
							control={form.control}
							name='backgroundStyle'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Background Style</FormLabel>
									<FormControl>
										<ColorPicker
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Location Field */}
						<FormField
							control={form.control}
							name='location'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<LocationInput
											value={field.value || { address: '' }}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Time Selector */}
						<FormField
							control={form.control}
							name='startTime'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Time</FormLabel>
									<FormControl>
										<TimeSelector
											value={{
												startTime: field.value,
												endTime: form.getValues('endTime')
											}}
											onChange={({ startTime, endTime }) => {
												field.onChange(startTime);
												form.setValue('endTime', endTime);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Capacity Field */}
						<FormField
							control={form.control}
							name='capacity'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Capacity</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Enter max capacity'
											className='max-w-[200px]'
											{...field}
											value={field.value || ''}
											onChange={(e) => {
												const value = e.target.value;
												field.onChange(value ? parseInt(value, 10) : null);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Switches Section */}
						<div className='flex flex-col sm:flex-row gap-4 sm:gap-8'>
							<FormField
								control={form.control}
								name='isPublic'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between gap-x-2'>
										<FormLabel>Public Event</FormLabel>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='requireApproval'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between gap-x-2'>
										<FormLabel>Require Approval</FormLabel>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<Button
							type='submit'
							disabled={isSubmitting}
							className='w-full sm:w-auto'>
							{isSubmitting ? 'Creating...' : 'Create Event'}
						</Button>
					</form>
				</Form>
			</div>

			{/* Preview Section */}
			<div className='w-full lg:w-1/2 mt-8 lg:mt-0'>
				<div className='lg:sticky lg:top-6'>
					<h2 className='text-lg font-semibold mb-4'>Preview</h2>
					<div className='bg-background rounded-lg'>
						<EventPreview data={form.watch()} />
					</div>
				</div>
			</div>
		</div>
	);
}
