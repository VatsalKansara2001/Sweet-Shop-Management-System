import React from 'react'
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Text,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const bg = useColorModeValue('white', 'gray.800')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box bg={bg} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold" color="brand.500">
            🍭 Sweet Shop
          </Link>
          <HStack as="nav" spacing={4}>
            <Link as={RouterLink} to="/sweets">
              Sweets
            </Link>
            {user?.is_admin && (
              <Link as={RouterLink} to="/admin">
                Admin
              </Link>
            )}
          </HStack>
        </HStack>

        <Stack direction="row" spacing={4}>
          {user ? (
            <>
              <Text fontSize="sm">Welcome, {user.email}</Text>
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={RouterLink} to="/register" size="sm">
                Register
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  )
}

export default Navbar