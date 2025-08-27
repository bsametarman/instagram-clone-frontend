import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Spinner,
    Alert,
    AlertIcon,
    Center,
    Grid,
    GridItem,
    Box,
    useColorModeValue
} from '@chakra-ui/react';

import postService from '../api/postService';
import PostDetailView from '../components/post/PostDetailView';
import CommentSection from '../components/post/CommentSection';

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await postService.getPostById(postId);
                setPost(response.data);
            } catch (err) {
                setError('Post not found or failed to load.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handlePostDelete = async () => {
        await postService.deletePost(postId);
        navigate(`/profile/${post.user.username}`);
    };

    const borderColor = useColorModeValue('blue.200', 'blue.600');

    if (isLoading) return <Center h="80vh"><Spinner size="xl" /></Center>;
    if (error) return <Container mt={8}><Alert status="error" color={"white"}><AlertIcon />{error}</Alert></Container>;
    if (!post) return null;

    return (
        <Box display="flex" flex="1" alignItems="center" justifyContent="center" p={{ base: 0, md: 4 }}>
            <Grid
                templateColumns={{ base: '1fr', lg: 'minmax(0, 3fr) minmax(0, 2fr)' }}
                h={{ base: 'auto', md: 'calc(100vh - 8rem)' }}
                maxH="1000px"
                w="full"
                maxW="1400px"
                borderWidth={{ base: 0, md: '1px' }}
                borderColor={borderColor}
                borderRadius={{ base: 0, md: 'md' }}
                overflow="hidden"
            >
                <GridItem bg="black" position="relative">
                    <PostDetailView post={post} onPostDelete={handlePostDelete} />
                </GridItem>

                <GridItem borderLeftWidth={{ lg: '1px' }} borderColor={borderColor} display="flex" overflow="hidden">
                    <CommentSection post={post} />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default PostDetailPage;