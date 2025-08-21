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
    InputGroup,
    InputRightElement,
    Link
} from '@chakra-ui/react';

import AuthLayout from '../components/common/AuthLayout';
import authService from '../api/authService';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        lastName: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            await authService.signup(formData);

            toast({
                title: 'Account created successfully.',
                description: "Please log in to continue.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });

            navigate('/login');

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create an Account">
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
                        <Input name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input name="name" placeholder="Your first name" value={formData.name} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input name="lastName" placeholder="Your last name" value={formData.lastName} onChange={handleChange} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Signing Up..."
                    >
                        Sign Up
                    </Button>
                </VStack>
            </form>

            <Text textAlign="center" mt={6}>
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color="blue.500" fontWeight="semibold">
                    Log in
                </Link>
            </Text>
        </AuthLayout>
    );
};

export default SignupPage;