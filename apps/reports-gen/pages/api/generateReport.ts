import type { NextApiRequest, NextApiResponse } from 'next';
import { defaultEditorContent } from "@/lib/content";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { report_url, data_url } = req.body;

    console.log('Quering the backend with :', report_url, data_url);

    try {
        // const response = await fetch('https://sundai-heron.tk.co/generate_report', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ report_url, data_url })
        // });

        // const response = await fetch(`https://sundai-heron.tk.co/generate_report?report_url=${encodeURIComponent(report_url)}&data_url=${encodeURIComponent(data_url)}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     console.log('Error on the backend side', response);
        //     console.log('Error data: ', JSON.stringify(errorData, null, 2));
        //     return res.status(response.status).json(errorData);
        // }

        // const jsonResponse = await response.json();
        const jsonResponse = defaultEditorContent;
        console.log('Succsefully got the responce from the backend: ', jsonResponse);
        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.log('Error while querying the backend', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
