import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma'; // Ajuste conforme sua configuração
import bcrypt from 'bcrypt';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password, role } = req.body; // role deve ser 'nutritionist' ou 'patient'

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({ error: 'User creation failed' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}