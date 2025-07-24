import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'

export async function getAuthenticatedUser(req) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }
  
  return session.user
}
