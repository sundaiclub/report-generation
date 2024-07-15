"use client";

import { Button } from "@/components/tailwind/ui/button";
import Menu from "@/components/tailwind/ui/menu";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Page() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/getAllReports');
        const result = await response.json();
        if (result.success) {
          setReports(result.data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 py-8 bg-gray-50 dark:bg-gray-900 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center justify-between px-4 sm:mb-16">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">Automatic Report Generator</div>
        <div className="flex ml-auto">
          <Menu />
        </div>
      </div>

      <div className="flex w-full max-w-screen-lg flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">Automatic Report Generation from Your Financial Data</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Brought to you by <a href="https://heron-ai.com" className="text-indigo-500 dark:text-indigo-300 hover:underline">Heron-AI</a> and <a href="https://sundai.club" className="text-indigo-500 dark:text-indigo-300 hover:underline">Sundai.Club</a>
        </p>
      </div>

      <div className="flex w-full max-w-screen-lg gap-8 px-4 pt-4 sm:px-0 justify-center">
        <Link href="/report">
          <Button className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-4 py-2 rounded">
            <BookOpen className="h-4 w-4" />
            Generate Report
          </Button>
        </Link>
      </div>

      <div className="flex w-full max-w-screen-lg flex-wrap gap-8 px-4 sm:px-0 mt-8">
        {reports.map(report => (
          <div key={report.id} className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{report.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-wrap gap-4">
                <p className="text-gray-600 dark:text-gray-400">Version: {report.version}</p>
                <p className="text-gray-600 dark:text-gray-400">Last Modified: {new Date(report.updatedAt).toLocaleDateString()}</p>
                <p className="text-gray-600 dark:text-gray-400">First Created: {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <Link href={`/report/${report.id}`} className="mt-4 inline-block">
                <Button className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-4 py-2 rounded">
                  View Report
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
