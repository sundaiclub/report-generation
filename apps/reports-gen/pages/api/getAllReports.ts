import prisma from 'db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	success: boolean;
	data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		const reports = await prisma.reports.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
		});
		res.status(200).json({ success: true, data: reports });
	} catch (error) {
		res.status(200).json({ success: false });
	}
}
