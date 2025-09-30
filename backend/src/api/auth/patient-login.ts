import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/backend/lib/prisma'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    // Try to find patient in database
    const patient = await prisma.user.findFirst({
      where: { email, role: 'CLIENT' } // Ensure the user is a patient
    })

    if (!patient) {
      return res.status(401).json({ message: 'Credenciais inválidas ou usuário não é um paciente' })
    }

    const isValidPassword = await bcrypt.compare(password, patient.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      {
        userId: patient.id,
        email: patient.email,
        role: patient.role
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '1h' }
    )

    res.status(200).json({
      token,
      user: {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        role: patient.role
      }
    })
  } catch (error) {
    console.error('Patient login error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
