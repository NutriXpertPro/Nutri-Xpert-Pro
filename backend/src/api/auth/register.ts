import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/backend/lib/prisma';
import bcrypt from 'bcrypt';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        let { email, password, role } = req.body; // role deve ser 'NUTRITIONIST' ou 'CLIENT'

        // Normalizar role para enum do Prisma
        if (role && typeof role === 'string') {
            role = role.toUpperCase();
            if (role === 'NUTRITIONIST' || role === 'CLIENT') {
                // ok
            } else {
                return res.status(400).json({ error: 'Role inválido. Use NUTRITIONIST ou CLIENT.' });
            }
        } else {
            role = 'CLIENT'; // padrão
        }

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