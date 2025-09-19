import React from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Input,
  VStack,
  HStack,
  Button,
  Select,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { sweetsService } from '../services/sweets'
import { Sweet } from '../types'
import SweetCard from '../components/SweetCard'

const SweetsPage: React.FC = () => {
  const [sweets, setSweets] = React.useState<Sweet[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [categories, setCategories] = React.useState<string[]>([])
  const toast = useToast()

  const loadSweets = async () => {
    try {
      const data = await sweetsService.getSweets()
      setSweets(data)
    } catch (error: any) {
      toast({
        title: 'Error loading sweets',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await sweetsService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchTerm) params.name = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const data = await sweetsService.searchSweets(params)
      setSweets(data)
    } catch (error: any) {
      toast({
        title: 'Search failed',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedCategory('')
    loadSweets()
  }

  React.useEffect(() => {
    loadSweets()
    loadCategories()
  }, [])

  if (loading && sweets.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" />
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading color="brand.500">Our Sweet Collection</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={4}>
          <HStack spacing={4} w="full">
            <Input
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </HStack>
          
          <HStack spacing={4}>
            <Button onClick={handleSearch} isLoading={loading}>
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </HStack>
        </VStack>
      </Box>

      {sweets.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            No sweets found. Try adjusting your search criteria.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onPurchase={loadSweets}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  )
}

export default SweetsPage