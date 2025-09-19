import React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { LoginData } from '../types'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    try {
      await login(data)
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading color="brand.500">Login</Heading>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                  />
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="brand.500">
                Register here
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

export default LoginPage