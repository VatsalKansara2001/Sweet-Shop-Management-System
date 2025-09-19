import React from 'react'
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { Sweet } from '../types'
import { inventoryService } from '../services/inventory'
import { useAuth } from '../contexts/AuthContext'

interface SweetCardProps {
  sweet: Sweet
  onPurchase?: () => void
  showAdminActions?: boolean
  onEdit?: (sweet: Sweet) => void
  onDelete?: (id: number) => void
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  showAdminActions,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: 'Please login to purchase',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      await inventoryService.purchaseSweet(sweet.id, 1)
      toast({
        title: 'Purchase successful!',
        description: `You bought ${sweet.name}`,
        status: 'success',
        duration: 3000,
      })
      onPurchase?.()
    } catch (error: any) {
      toast({
        title: 'Purchase failed',
        description: error.response?.data?.detail || 'Something went wrong',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <VStack align="start" spacing={3}>
          <Heading size="md" color="brand.600">
            {sweet.name}
          </Heading>
          
          <Badge colorScheme={sweet.quantity > 0 ? 'green' : 'red'}>
            {sweet.category}
          </Badge>

          {sweet.description && (
            <Text fontSize="sm" color="gray.600">
              {sweet.description}
            </Text>
          )}

          <HStack justify="space-between" w="full">
            <Text fontSize="lg" fontWeight="bold" color="brand.500">
              ${sweet.price.toFixed(2)}
            </Text>
            <Text fontSize="sm" color={sweet.quantity > 0 ? 'green.500' : 'red.500'}>
              Stock: {sweet.quantity}
            </Text>
          </HStack>

          <VStack w="full" spacing={2}>
            <Button
              w="full"
              size="sm"
              isDisabled={!sweet.is_in_stock}
              isLoading={isLoading}
              onClick={handlePurchase}
            >
              {sweet.is_in_stock ? 'Purchase' : 'Out of Stock'}
            </Button>

            {showAdminActions && user?.is_admin && (
              <HStack w="full" spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  flex={1}
                  onClick={() => onEdit?.(sweet)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  flex={1}
                  onClick={() => onDelete?.(sweet.id)}
                >
                  Delete
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default SweetCard