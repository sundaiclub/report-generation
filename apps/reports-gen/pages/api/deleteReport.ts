// /pages/api/deleteReport.js
import prisma from 'db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "Report ID is required" });
  }

  try {
    await prisma.reports.delete({
      where: { id: id },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete report" });
  }
}
