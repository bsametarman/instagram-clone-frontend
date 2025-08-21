import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Alert,
    AlertIcon,
    Link
} from '@chakra-ui/react';

import AuthLayout from '../components/common/AuthLayout';
import { useAuth } from '../context/AuthContext';

const SigninPage = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(formData);

            toast({
                title: 'Logged in successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });

            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Log In to Your Account">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    {error && (
                        <Alert status="error" borderRadius="md" textColor={"white"}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            name="login"
                            placeholder="Enter your username"
                            value={formData.login}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Logging In..."
                    >
                        Log In
                    </Button>
                </VStack>
            </form>

            <Text textAlign="center" mt={6}>
                Don't have an account?{' '}
                <Link as={RouterLink} to="/signup" color="blue.500" fontWeight="semibold">
                    Sign Up
                </Link>
            </Text>
        </AuthLayout>
    );
};

export default SigninPage;