import { Button } from "@/components/tailwind/ui/button";
import Menu from "@/components/tailwind/ui/menu";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
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

      <div className="flex w-full max-w-screen-lg gap-8 px-4 sm:px-0">
        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Generate New Report</h2>
          <p className="text-gray-600 dark:text-gray-400">Create a new report from your financial data.</p>
          <Link href="/report" className="ml-auto">
            <Button className="mt-4 flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-4 py-2 rounded">
              <BookOpen className="h-4 w-4" />
              Generate Report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
