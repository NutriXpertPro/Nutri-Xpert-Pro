import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

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

    // Try to find user in database
    let user = await prisma.user.findUnique({
      where: { email }
    })

    // If no user exists and it's the default admin, create it
    if (!user && email === 'admin@nutriexpert.com') {
      const bcrypt = require('bcrypt')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      user = await prisma.user.create({
        data: {
          email: 'admin@nutriexpert.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'admin'
        }
      })
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}