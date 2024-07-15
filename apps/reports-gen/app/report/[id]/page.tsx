"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EditorRoot, EditorContent } from 'novel'; // Import the required editor components

const ReportPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchReport() {
        try {
          const response = await fetch(`/api/getReportById?id=${id}`);
          const result = await response.json();
          if (result.success) {
            setReport(result.data);
          } else {
            console.error('Failed to fetch the report');
          }
        } catch (error) {
          console.error('Error fetching report:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchReport();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>Report not found</p>;

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 py-8 bg-gray-50 dark:bg-gray-900 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center justify-between px-4 sm:mb-16">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{report.name}</div>
      </div>

      <div className="relative w-full max-w-screen-lg">
        <EditorRoot>
          <EditorContent
            initialContent={report.data}
            extensions={[]} // Add the required extensions if necessary
            className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
            readOnly
          />
        </EditorRoot>
      </div>
    </div>
  );
};

export default ReportPage;
