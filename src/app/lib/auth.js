import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'

export async function getAuthenticatedUser() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    
    return session.user
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Unauthorized')
  }
}
