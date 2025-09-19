import React from 'react'
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { sweetsService } from '../services/sweets'
import { inventoryService } from '../services/inventory'
import { Sweet } from '../types'
import SweetCard from '../components/SweetCard'

const AdminPage: React.FC = () => {
  const [sweets, setSweets] = React.useState<Sweet[]>([])
  const [editingSweet, setEditingSweet] = React.useState<Sweet | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Sweet>()

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

  const handleCreateSweet = () => {
    setEditingSweet(null)
    reset()
    onOpen()
  }

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setValue('name', sweet.name)
    setValue('category', sweet.category)
    setValue('price', sweet.price)
    setValue('quantity', sweet.quantity)
    setValue('description', sweet.description || '')
    onOpen()
  }

  const handleDeleteSweet = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsService.deleteSweet(id)
        toast({
          title: 'Sweet deleted successfully',
          status: 'success',
          duration: 3000,
        })
        loadSweets()
      } catch (error: any) {
        toast({
          title: 'Error deleting sweet',
          description: error.response?.data?.detail || 'Something went wrong',
          status: 'error',
          duration: 5000,
        })
      }
    }
  }

  const onSubmit = async (data: Sweet) => {
    try {
      if (editingSweet) {
        await sweetsService.updateSweet(editingSweet.id, data)
        toast({
          title: 'Sweet updated successfully',
          status: 'success',
          duration: 3000,
        })
      } else {
        await sweetsService.createSweet(data)
        toast({
          title: 'Sweet created successfully',
          status: 'success',
          duration: 3000,
        })
      }
      onClose()
      loadSweets()
    } catch (error: any) {
      toast({
        title: editingSweet ? 'Error updating sweet' : 'Error creating sweet',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 5000,
      })
    }
  }

  React.useEffect(() => {
    loadSweets()
  }, [])

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading color="brand.500">Admin Dashboard</Heading>
        <Button colorScheme="brand" onClick={handleCreateSweet}>
          Add New Sweet
        </Button>
      </HStack>

      {sweets.length === 0 && !loading ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            No sweets found. Create your first sweet!
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              showAdminActions
              onEdit={handleEditSweet}
              onDelete={handleDeleteSweet}
              onPurchase={loadSweets}
            />
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register('name', { required: 'Name is required' })}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Input
                    {...register('category', { required: 'Category is required' })}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Price</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('price', { required: 'Price is required', min: 0 })}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isInvalid={!!errors.quantity}>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('quantity', { required: 'Quantity is required', min: 0 })}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea {...register('description')} />
                </FormControl>

                <HStack spacing={4} w="full">
                  <Button type="submit" colorScheme="brand" flex={1}>
                    {editingSweet ? 'Update' : 'Create'}
                  </Button>
                  <Button variant="outline" onClick={onClose} flex={1}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default AdminPage