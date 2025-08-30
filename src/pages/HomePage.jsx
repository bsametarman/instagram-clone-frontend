import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, SimpleGrid, Spinner, Flex, Text, Box, useColorMode } from '@chakra-ui/react';
import postService from '../api/postService';
import PostCard from '../components/post/PostCard';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const { colorMode, toggleColorMode } = useColorMode();

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 0 && loading) return;

        setLoading(true);
        setError(null);

        postService.getMainPageFeedPosts('', page, 9)
            .then(response => {
                setPosts(prevPosts => {
                    const newPosts = response.data.content;
                    const existingPostIds = new Set(prevPosts.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter(p => !existingPostIds.has(p.id));
                    return [...prevPosts, ...uniqueNewPosts];
                });
                setHasMore(!response.data.last);
            })
            .catch(err => {
                console.error("Error while loading feed:", err);
                setError("Could not load the feed. Try later!");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page]);

    if (loading && posts.length === 0) {
        return (
            <Flex justify="center" align="center" height="calc(100vh - 80px)">
                <Spinner size="xl" thickness="4px" color="blue.500" />
            </Flex>
        );
    }

    if (!loading && posts.length === 0) {
        return (
            <Flex justify="center" align="center" height="calc(100vh - 80px)">
                <Flex justify="center" my={6}>
                    <Text color={colorMode == 'light' ? 'black' : 'white'}>Friend's posts</Text>
                </Flex>
                <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">Wow such empty!</Text>
                    <Text mt={2} color="gray.500">
                        Follow people to see their posts.
                    </Text>
                </Box>
            </Flex>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Flex justify="center" my={6}>
                <Text color={colorMode == 'light' ? 'black' : 'white'}>Friend's posts</Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <Box ref={lastPostElementRef} key={post.id}>
                                <PostCard post={post} />
                            </Box>
                        );
                    } else {
                        return <PostCard post={post} key={post.id} />;
                    }
                })}
            </SimpleGrid>

            {loading && (
                <Flex justify="center" my={6}>
                    <Spinner color="blue.500" />
                </Flex>
            )}

            {error && (
                <Flex justify="center" my={6}>
                    <Text color="red.500">{error}</Text>
                </Flex>
            )}

            {!hasMore && posts.length > 0 && (
                <Flex justify="center" my={6}>
                    <Text color="gray.500">You have seen all posts. ✨</Text>
                </Flex>
            )}
        </Container>
    );
};

export default HomePage;