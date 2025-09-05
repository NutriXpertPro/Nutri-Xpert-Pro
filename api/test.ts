import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`
    res.status(200).json({ success: true, time: result })
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }
}