import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Ajuste conforme sua configuração

export default async function handleEvaluations(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const evaluations = await prisma.evaluation.findMany(); // Busca todas as avaliações
        return res.status(200).json(evaluations);
    } else if (req.method === 'POST') {
        const { patientId, weight, neckMeasurement, waistMeasurement, photos } = req.body;

        try {
            const newEvaluation = await prisma.evaluation.create({
                data: {
                    patientId,
                    weight,
                    neckMeasurement,
                    waistMeasurement,
                    photos,
                },
            });
            return res.status(201).json(newEvaluation);
        } catch (error) {
            return res.status(500).json({ error: 'Evaluation creation failed' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}