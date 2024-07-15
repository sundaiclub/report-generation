"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import Link from "next/link";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { ArrowLeft, BookOpen} from "lucide-react";

export default function ReportPage() {
  const [reportData, setReportData] = useState<any>(null);
  const params = useParams<any>();
  let id:number = 0;
  if (params && params.id) {
    id = parseInt(params.id);
  }


  useEffect(() => {
    if (id) {
      async function fetchReport() {
        try {
          const response = await fetch(`/api/getReportByID?id=${id}`);
          const result = await response.json();
          console.log('Fetch result:', result);
          if (result.success) {
            setReportData(result.data);
            console.log('Report data set:', result.data);
          } else {
            console.error('Report not found or error in fetching:', result.data);
          }
        } catch (error) {
          console.error('Error fetching report:', error);
        }
      }
      fetchReport();
    }
  }, [id]);

  if (!reportData) {
    return (
      <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
        <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(20vh)]">
          <Link href={`/`} className="mt-4 inline-block">
            <div className="flex ml-auto">
              <ArrowLeft className="h-4 w-4"/>
            </div>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml gap-2">
                <BookOpen className="h-4 w-4" />
                Show in dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
              <ScrollArea className="max-h-screen">
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <div className="flex ml-auto">
            <Menu />
          </div>
        </div>
          Loading ...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(20vh)]">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml gap-2">
              <BookOpen className="h-4 w-4" />
              Show in dialog
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
            <ScrollArea className="max-h-screen">
              <TailwindAdvancedEditor initialContent={reportData.data} reportData={reportData} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <div className="flex ml-auto">
          <Menu />
        </div>
      </div>
      <TailwindAdvancedEditor initialContent={reportData.data} reportData={reportData} />
    </div>
  );
}