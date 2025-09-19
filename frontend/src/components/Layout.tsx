import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'

const Layout: React.FC = () => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default Layout