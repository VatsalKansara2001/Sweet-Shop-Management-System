import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa'

const HomePage: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW="container.lg">
      <VStack spacing={10} textAlign="center" py={10}>
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="brand.500">
            🍭 Sweet Shop Management System
          </Heading>
          <Text fontSize="lg" color="gray.600">
            A comprehensive TDD-based sweet shop management system built with FastAPI and React
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
          <Box bg={bg} p={6} rounded="lg" shadow="md" textAlign="center">
            <Icon as={FaShoppingCart} boxSize={10} color="brand.500" mb={4} />
            <Heading size="md" mb={2}>
              Browse Sweets
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Discover our delicious collection of sweets and treats
            </Text>
            <Button as={RouterLink} to="/sweets" colorScheme="brand" size="sm">
              Shop Now
            </Button>
          </Box>

          <Box bg={bg} p={6} rounded="lg" shadow="md" textAlign="center">
            <Icon as={FaUsers} boxSize={10} color="brand.500" mb={4} />
            <Heading size="md" mb={2}>
              Join Us
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Create an account to start purchasing your favorite sweets
            </Text>
            <Button as={RouterLink} to="/register" colorScheme="brand" variant="outline" size="sm">
              Register
            </Button>
          </Box>

          <Box bg={bg} p={6} rounded="lg" shadow="md" textAlign="center">
            <Icon as={FaCog} boxSize={10} color="brand.500" mb={4} />
            <Heading size="md" mb={2}>
              Admin Panel
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Manage inventory, add new sweets, and track sales
            </Text>
            <Button as={RouterLink} to="/admin" colorScheme="brand" variant="outline" size="sm">
              Admin
            </Button>
          </Box>
        </SimpleGrid>

        <Box textAlign="center" py={8}>
          <Text fontSize="md" color="gray.500">
            Built with ❤️ using Test-Driven Development and AI assistance
          </Text>
          <Text fontSize="sm" color="gray.400" mt={2}>
            FastAPI • React • TypeScript • Chakra UI • PostgreSQL
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}

export default HomePage