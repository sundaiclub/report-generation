import prisma from 'db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	success: boolean;
	info?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	let { name, data, version } = req.body;

	if (!name || !data || !version) {
		res.status(200).json({ success: false });
	}

	await prisma.reports.create({
		data: {
			name,
			data,
			version
		}
	});

	res.status(200).json({ success: true });
}