import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Data = {
  success: boolean;
  data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        res.status(400).json({ success: false, data: 'Invalid report ID' });
        return;
    }

    try {
        const report = await prisma.reports.findUnique({
            where: { id: Number(id) },
    });

    if (report) {
      res.status(200).json({ success: true, data: report });
    } else {
      res.status(404).json({ success: false, data: 'Report not found' });
    }
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ success: false, data: 'Server error' });
  }
}
