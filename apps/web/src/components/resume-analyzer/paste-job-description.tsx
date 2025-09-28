'use client';

import React, { useState } from 'react';
import { Button } from '@resume-platform/ui';
import { Textarea } from '@resume-platform/ui';

interface PasteJobDescriptionProps {
	onClose: () => void;
	onPaste: (text: string) => void;
}

export default function PasteJobDescription({ onClose, onPaste }: PasteJobDescriptionProps) {
	const [jobDescription, setJobDescription] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handlePaste = () => {
		if (!jobDescription.trim()) {
			setError('Job description cannot be empty.');
			return;
		}
		setError(null);
		onPaste(jobDescription);
		onClose(); // Close modal after pasting
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="relative w-full max-w-2xl rounded-xl bg-background p-6 shadow-xl border">
				<div className="flex items-center justify-between pb-4 border-b">
					<h3 className="text-lg font-semibold">Paste Job Description</h3>
					<Button
						size="icon"
						variant="ghost"
						className="text-muted-foreground/80 hover:text-foreground -me-2 size-9 hover:bg-transparent"
						onClick={onClose}
						aria-label="Close modal"
					>
						{/* Using a simple 'X' as a replacement for the icon */}
						X
					</Button>
				</div>

				<div className="py-6">
					<div className="flex flex-col items-center justify-center text-center mb-4">
						<div
							className="bg-muted mb-3 flex size-12 shrink-0 items-center justify-center rounded-full border"
							aria-hidden="true"
						>
							{/* Using a simple emoji as a replacement for the icon */}
							📋
						</div>
						<p className="mb-2 text-lg font-semibold">
							Paste Job Description
						</p>
						<p className="text-muted-foreground text-sm">
							Paste the full job description text below.
						</p>
					</div>

					<Textarea
						value={jobDescription}
						onChange={(e) => {
							setJobDescription(e.target.value);
							if (error) setError(null);
						}}
						placeholder="Paste job description here..."
						className="w-full min-h-[200px] rounded-md p-3 focus:ring-ring focus:border-ring"
						aria-label="Job description text area"
					/>
					{error && (
						<p className="text-destructive mt-2 text-xs" role="alert">
							{error}
						</p>
					)}
				</div>

				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button
						variant="outline"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						onClick={handlePaste}
					>
						Save Job Description
					</Button>
				</div>
			</div>
		</div>
	);
}