import { ImprovedResult } from '@/components/ats/resume-preview-context';

const API_URL = 'http://localhost:8000';

/** Uploads job descriptions and returns a job_id */
export async function uploadJobDescriptions(
    descriptions: string[],
    resumeId: string
): Promise<string> {
    const res = await fetch(`${API_URL}/job/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: descriptions[0], resume_id: resumeId }),
    });
    if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
    const data = await res.json();
    console.log('Job upload response:', data);
    return data.job_id;
}

/** Improves the resume and returns the full preview object */
export async function improveResume(
    resumeId: string,
    jobId: string
): Promise<ImprovedResult> {
    const response = await fetch(`${API_URL}/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_id: resumeId, job_id: jobId }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Improve failed response body:', errorText);
        throw new Error(`Improve failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Resume improvement response:', data);
    return data as ImprovedResult;
}