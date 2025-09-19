import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Ajuste conforme sua configuração

export default async function handlePatients(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const patients = await prisma.patient.findMany(); // Acha todos os pacientes
        return res.status(200).json(patients);
    } else if (req.method === 'POST') {
        const { name, age, sex, profession } = req.body;

        try {
            const newPatient = await prisma.patient.create({
                data: {
                    name,
                    age,
                    sex,
                    profession,
                },
            });
            return res.status(201).json(newPatient);
        } catch (error) {
            return res.status(500).json({ error: 'Patient creation failed' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}