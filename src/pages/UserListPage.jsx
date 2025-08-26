import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import userService from '../api/userService';
import useDebounce from '../hooks/useDebounce';
import UserCard from '../components/user/UserCard';
import Pagination from '../components/common/Pagination';

const UsersListPage = () => {
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('createdDate,desc');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchUsers = useCallback(async (pageToFetch) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userService.getAllActiveUsers(
                debouncedSearchTerm,
                pageToFetch,
                12,
                sort
            );
            setPageData(response.data);
        } catch (err) {
            setPageData(null);
            console.error("Fetch users error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, sort]);

    useEffect(() => {
        setCurrentPage(0);
        fetchUsers(0);
    }, [debouncedSearchTerm, sort, fetchUsers]);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);


    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < (pageData?.totalPages || 0)) {
            setCurrentPage(pageNumber);
        }
    };

    if (isLoading && !pageData) {
        return <Center h="80vh"><Spinner size="xl" /></Center>;
    }

    if (error) {
        return <Container mt={8}><Alert status="error" color={"white"}><AlertIcon />{error}</Alert></Container>;
    }

    if (!pageData || pageData.content.length === 0) {
        return (
            <Container maxW="container.xl" py={8}>
                <Heading as="h1" mb={8} textAlign="center">
                    Users
                </Heading>

                <Flex my={8} direction={{ base: 'column', md: 'row' }} gap={4}>
                    <Box flex="1">
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="blue.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search by username, name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Box>
                    <Select
                        w={{ base: 'full', md: '250px' }}
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="createdDate,desc">Newest Users</option>
                        <option value="createdDate,asc">Oldest Users</option>
                        <option value="username,asc">Username (A-Z)</option>
                        <option value="username,desc">Username (Z-A)</option>
                    </Select>
                </Flex>
                <Container maxW="container.xl" py={8}>
                    <Center><p>No users found.</p></Center>
                </Container>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" mb={8} textAlign="center">
                Users
            </Heading>

            <Flex my={8} direction={{ base: 'column', md: 'row' }} gap={4}>
                <Box flex="1">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="blue.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search by username, name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Box>
                <Select
                    w={{ base: 'full', md: '250px' }}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="createdDate,desc">Newest Users</option>
                    <option value="createdDate,asc">Oldest Users</option>
                    <option value="username,asc">Username (A-Z)</option>
                    <option value="username,desc">Username (Z-A)</option>
                </Select>
            </Flex>

            {isLoading ? (
                <Center h="300px"><Spinner size="xl" /></Center>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                    {pageData.content.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </SimpleGrid>
            )}

            <Pagination
                currentPage={pageData.page}
                totalPages={pageData.totalPages}
                onPageChange={handlePageChange}
            />
        </Container>
    );
};

export default UsersListPage;