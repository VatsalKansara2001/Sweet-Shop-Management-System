import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Spinner, Text } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !user.is_admin) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="xl" color="red.500">
          Access Denied: Admin privileges required
        </Text>
      </Box>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute