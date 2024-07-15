import prisma from 'db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	success: boolean;
	id?: number;
	data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	let { id, name, data, version } = req.body;

	console.log('Adding report:', name, data, version);
	if (!name || !data || !version) {
		res.status(200).json({ success: false });
	}

	let report;
	if (id) {
		console.log('Updating report:', id);
		// Update existing report
		report = await prisma.reports.update({
		where: { id: id },
		data: {
			name,
			data,
			version
		}
		});
	} else {
		// Create new report
		report = await prisma.reports.create({
		data: {
			name,
			data,
			version
		}
		});
	}

	console.log('Added report:', report.id);
	res.status(200).json({ success: true, data: report, id: report.id });
}
