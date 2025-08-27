import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Avatar,
    Text,
    Input,
    Button,
    Spinner,
    useColorModeValue,
    Center,
    Tooltip,
    Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import commentService from '../../api/commentService';
import OptionsMenu from '../common/OptionsMenu';

const CommentSection = ({ post }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    const { user: currentUser, isLoggedIn } = useAuth();
    const headerBg = useColorModeValue('blue.300', 'blue.500');
    const borderColor = useColorModeValue('blue.200', 'blue.600');


    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await commentService.getCommentsByPostId(post.id);
                setComments(response.data.content || []);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [post.id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsPosting(true);
        try {
            const response = await commentService.addComment(post.id, { text: newComment });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleCommentDelete = async (commentId) => {
        await commentService.deleteComment(post.id, commentId);
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
    };

    return (
        <Box display="flex" flexDirection="column" flex="1" w="full">
            <VStack align='stretch' p={4} borderBottomWidth="1px" borderBottomColor={borderColor} bg={headerBg}>
                <HStack p={4} borderBottomWidth="1px" borderColor={'black'} bg={headerBg}>
                    <Avatar as={RouterLink} to={`/profile/${post.user.username}`} size="sm" name={post.user.username} src={post.user.profilePictureUrl} />
                    <ChakraLink as={RouterLink} to={`/profile/${post.user.username}`} fontWeight="bold">
                        {post.user.username}
                    </ChakraLink>
                </HStack>
                <VStack align={'left'}>
                    <Text align={'left'}>
                        Description:
                    </Text>
                    <Text align={'left'}>
                        {post.description}
                    </Text>
                </VStack>
            </VStack>

            <VStack
                flex="1"
                p={4}
                spacing={4}
                align="stretch"
                overflowY="auto"
                maxH="100%"
            >
                {isLoading ? (
                    <Center h="full"><Spinner /></Center>
                ) : comments.length > 0 ? (
                    comments.map(comment => {
                        const isCommentOwner = currentUser?.id === comment.user.id;
                        const isPostOwner = currentUser?.id === post.user.id;
                        const canDelete = isCommentOwner || isPostOwner;

                        return (
                            <HStack key={comment.id} align="flex-start" spacing={3} w="full">
                                <Avatar
                                    as={RouterLink}
                                    to={`/profile/${comment.user.username}`}
                                    size="xs"
                                    name={comment.user.fullName || comment.user.username}
                                    src={comment.user.profilePictureUrl}
                                />
                                <VStack align="flex-start" spacing={0} flex="1">
                                    <Text fontSize="sm">
                                        <ChakraLink as={RouterLink} to={`/profile/${comment.user.username}`} fontWeight="bold">
                                            {comment.user.username}
                                        </ChakraLink>{' '}
                                        {comment.text}
                                    </Text>
                                    <Tooltip label={new Date(comment.createdAt).toLocaleString()} placement="top" hasArrow>
                                        <Text fontSize="xs" color="gray.500">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </Text>
                                    </Tooltip>
                                </VStack>
                                {isLoggedIn && canDelete && (
                                    <OptionsMenu item="comment" onDelete={() => handleCommentDelete(comment.id)} />
                                )}
                            </HStack>
                        );
                    })
                ) : (
                    <Center h="full">No comments</Center>
                )}
            </VStack>

            {isLoggedIn && (
                <Box p={4} borderTopWidth="1px" borderColor={borderColor}>
                    <form onSubmit={handleCommentSubmit}>
                        <HStack>
                            <Input
                                variant="unstyled"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button type="submit" variant="ghost" colorScheme="blue" isLoading={isPosting}>
                                Post
                            </Button>
                        </HStack>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default CommentSection;