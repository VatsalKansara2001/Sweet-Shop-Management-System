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
import { RegisterData } from '../types'

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>()

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast({
        title: 'Registration successful!',
        description: 'Welcome to Sweet Shop!',
        status: 'success',
        duration: 3000,
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Registration failed',
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
            <Heading color="brand.500">Register</Heading>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.full_name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    {...register('full_name')}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                  />
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="brand.500">
                Login here
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

export default RegisterPage