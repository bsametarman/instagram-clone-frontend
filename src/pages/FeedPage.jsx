import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Heading, SimpleGrid, Spinner, Center, Alert, AlertIcon,
    Input, InputGroup, InputLeftElement, Select, Flex, Box, Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import postService from '../api/postService';
import useDebounce from '../hooks/useDebounce';
import PostCard from '../components/post/PostCard';
import Pagination from '../components/common/Pagination';

const FeedPage = () => {

    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('createdAt,desc');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchFeed = useCallback((pageToFetch) => {
        setIsLoading(true);
        setError(null);
        postService.getFeedPosts(debouncedSearchTerm, pageToFetch, 12, sort)
            .then(response => {
                setPageData(response.data);
            })
            .catch(err => {
                setError('Failed to load the feed.');
                console.error("Fetch feed error:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [debouncedSearchTerm, sort]);

    useEffect(() => {
        setCurrentPage(0);
        fetchFeed(0);
    }, [debouncedSearchTerm, sort, fetchFeed]);

    useEffect(() => {
        fetchFeed(currentPage);
    }, [currentPage, fetchFeed]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < (pageData?.totalPages || 0)) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" mb={4}>Feed</Heading>
            <Text color="gray.500" mb={8}>Explore posts from users.</Text>

            <Flex my={8} direction={{ base: 'column', md: 'row' }} gap={4}>
                <Box flex="1">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none"><SearchIcon color="blue.300" /></InputLeftElement>
                        <Input
                            placeholder="Search in all posts..."
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
                    <option value="createdAt,desc">Newest</option>
                    <option value="likeCount,desc">Most Popular (Likes)</option>
                    <option value="commentCount,desc">Most Discussed</option>
                    <option value="createdAt,asc">Oldest</option>
                </Select>
            </Flex>

            {isLoading && !pageData ? <Center h="300px"><Spinner size="xl" color='blue.300' /></Center> : null}
            {error ? <Alert status="error" borderRadius="md" textColor={"white"}><AlertIcon />{error}</Alert> : null}

            {pageData && (
                <>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                        {pageData.content.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </SimpleGrid>
                    <Pagination
                        currentPage={pageData.page}
                        totalPages={pageData.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Container>
    );
};

export default FeedPage;