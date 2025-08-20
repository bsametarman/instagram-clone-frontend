import React from 'react';
import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AuthLayout = ({ title, children }) => {
    const pageBg = useColorModeValue('gray.50', '#1a1514');
    const cardBg = useColorModeValue('white', 'black');
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

    return (
        <Box minH="100vh" bg={pageBg} py={12} px={4}>
            <Box
                maxW="xl"
                w="full"
                mx="auto"
            >
                <Box textAlign="center" mb={8}>
                    <Heading as={RouterLink} to="/" size="xl" color={textColor} _hover={{ textDecoration: 'none' }}>
                        InstagramClone
                    </Heading>
                    <Heading as="h2" size="lg" mt={4} color="gray.500" fontWeight="normal">
                        {title}
                    </Heading>
                </Box>
                <Box
                    bg={cardBg}
                    p={8}
                    rounded="xl"
                    shadow="lg"
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AuthLayout;