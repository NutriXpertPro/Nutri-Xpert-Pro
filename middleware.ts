import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Protege rotas /dashboard/*
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ['/dashboard/:path*'] }