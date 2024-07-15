"use client";

import { Button } from "@/components/tailwind/ui/button";
import Menu from "@/components/tailwind/ui/menu";
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function NewReportPage() {
    const [name, setName] = useState('New Report');
    const [version, setVersion] = useState(1);
    const [file, setFile] = useState(new Blob());
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSubmit = async () => {
        setLoading(true);
        try {
        // Upload file to S3
        const formData = new FormData();
        if (!file) {
            throw new Error('No file selected');
        }
        formData.append('file', file);

        const s3Response = await fetch('/api/uploadToS3', {
            method: 'POST',
            body: formData,
        });

        const s3Result = await s3Response.json();
        if (!s3Result.success) {
            throw new Error('Failed to upload file to S3');
        }

        const report_url = s3Result.fileUrl;

        // Make long API call to create submission
        const submissionResponse = await fetch('/api/generateReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ report_url })
        });

        const data = await submissionResponse.json();
        // if (!submissionResult.success) {
        //     throw new Error('Failed to create submission');
        // }

        // Save result to database with Prisma
        const prismaResponse = await fetch('/api/addReport', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, data, version })
        });

        const prismaResult = await prismaResponse.json();
        if (!prismaResult.success) {
            throw new Error('Failed to save report');
        }
        const id = prismaResult.id;

        // Navigate to the new report page
        router.push(`/report/${id}`);
        } catch (error) {
        console.error('Error submitting report:', error);
        setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center gap-8 py-8 bg-gray-50 dark:bg-gray-900 sm:px-5">
        <div className="flex w-full max-w-screen-lg items-center justify-between px-4 sm:mb-16">
            <Link href={`/`} className="mt-4 inline-block">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">Automatic Report Generator</div>
            </Link>
            <div className="flex ml-auto">
            <Menu />
            </div>
        </div>

        <div className="flex w-full max-w-screen-lg flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">Create a New Report</h1>
        </div>

        <div className="flex w-full max-w-screen-lg flex-col items-center gap-4 px-4 pt-4 sm:px-0">
            <div className="w-full">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-left">Name of the report</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                placeholder="New Report"
            />
            </div>
            <div className="w-full">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-left">Version</label>
            <input
                type="number"
                value={version}
                onChange={(e) => setVersion(parseInt(e.target.value))}
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                placeholder="1"
            />
            </div>
            <div
            {...getRootProps()}
            className="w-full h-48 p-8 border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 flex items-center justify-center"
            >
            <input {...getInputProps()} />
            {file ? (
                <p className="text-lg text-gray-700 dark:text-gray-300">{file.name}</p>
            ) : (
                <p className="text-lg text-gray-600 dark:text-gray-400">Drag and drop a file here, or click to select a file</p>
            )}
            </div>
            <Button
            className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-6 py-3 rounded-lg text-lg"
            onClick={handleSubmit}
            disabled={loading}
            >
            {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </div>
        </div>
    );
}
