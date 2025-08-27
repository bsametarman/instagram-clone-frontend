import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AspectRatio, IconButton, Flex, useToast, HStack, Text, Tooltip } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import likeService from '../../api/likeService';
import { useAuth } from '../../context/AuthContext';
import OptionsMenu from './../common/OptionsMenu';

const PostDetailView = ({ post, onPostDelete }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user: currentUser, isLoggedIn } = useAuth();

    const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const isOwner = currentUser?.id === post.user.id;

    const handleLikeToggle = async () => {
        if (!isLoggedIn) {
            toast({
                title: 'Please log in to like a post.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLikeLoading(true);

        try {
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

            const response = await likeService.toggleLike(post.id);

            setIsLiked(response.data.liked);
            setLikeCount(response.data.newLikeCount);

        } catch (error) {
            console.error('Failed to toggle like', error);
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
            toast({
                title: 'An error occurred.',
                description: 'Could not update like status.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLikeLoading(false);
        }
    };

    return (
        <Flex
            h="full"
            w="full"
            align="center"
            justify="center"
            bg="black"
            position="relative"
            overflow="hidden"
        >
            <Flex
                position="absolute"
                top={0}
                left={0}
                right={0}
                p={2}
                zIndex="docked"
                justify="space-between"
                bgGradient="linear(to-b, blackAlpha.600, transparent)"
            >
                <IconButton
                    icon={<ArrowBackIcon />}
                    aria-label="Go back"
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.300' }}
                />

                <HStack>
                    {isOwner && (
                        <OptionsMenu item="post" onDelete={onPostDelete} />
                    )}

                    <Tooltip label={isLiked ? 'Unlike' : 'Like'} placement="bottom" hasArrow>
                        <IconButton
                            icon={isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                            aria-label="Like post"
                            onClick={handleLikeToggle}
                            isLoading={isLikeLoading}
                            variant="ghost"
                            color="blue.500"
                            fontSize="24px"
                            _hover={{ bg: 'whiteAlpha.300' }}
                        />
                    </Tooltip>
                </HStack>
            </Flex>

            {post.mediaType === 'IMAGE' ? (
                <Box
                    w="full"
                    h="full"
                    bgImage={`url(${post.imageUrl})`}
                    bgSize="contain"
                    bgRepeat="no-repeat"
                    bgPos="center"
                />
            ) : (
                <AspectRatio ratio={16 / 9} w="100%" maxH="100%">
                    <video src={post.videoUrl} controls autoPlay loop style={{ width: '100%', height: '100%' }} />
                </AspectRatio>
            )}

            <Flex position="absolute" bottom={4} left={4} zIndex="docked" align="center">
                {likeCount > 0 && (
                    <HStack bg="blackAlpha.600" p={2} borderRadius="md">
                        <FaHeart color="white" />
                        <Text color="white" fontWeight="bold" fontSize="sm">
                            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                        </Text>
                    </HStack>
                )}
            </Flex>
        </Flex>
    );
};

export default PostDetailView;