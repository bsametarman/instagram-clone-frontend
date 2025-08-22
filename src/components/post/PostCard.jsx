import React from 'react';
import { Box, Image, AspectRatio, VStack, HStack, Avatar, Text, Heading, Icon, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaHeart, FaComment, FaVideo } from 'react-icons/fa';

const PostCard = ({ post }) => {
    const { colorMode, toogleColorMode } = useColorMode();

    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box
            bg={cardBg}
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
        >
            <RouterLink to={`/p/${post.id}`}>
                <AspectRatio ratio={4 / 3}>
                    <Box h="150px" w="full" bg="gray.200" position="relative">
                        {post.mediaType === 'IMAGE' ? (
                            <Image src={post.imageUrl}
                                objectFit="scale-down"
                                w="100%"
                                h="100%"
                                backgroundColor={"black"}
                            />
                        ) : (
                            <Center bg="black">
                                <Icon as={FaVideo} color="whiteAlpha.800" boxSize={16} />
                            </Center>
                        )}
                    </Box>
                </AspectRatio>
            </RouterLink>

            <VStack p={4} align="stretch" spacing={3} backgroundColor={colorMode == "light" ? "white" : "#1a1514"} borderColor="blue">
                <Heading as="h3" size="sm" noOfLines={2}>
                    {post.title || post.description}
                </Heading>
                <HStack justify="space-between">
                    <RouterLink to={`/profile/${post.user.username}`}>
                        <HStack>
                            <Avatar size="xs" name={post.user.username} src={post.user.profilePictureUrl} />
                            <Text fontSize="xs" fontWeight="medium">{post.user.username}</Text>
                        </HStack>
                    </RouterLink>
                    <HStack spacing={4} color="blue.500">
                        <HStack spacing={1}>
                            <Icon as={FaHeart} />
                            <Text fontSize="xs">{post.likeCount}</Text>
                        </HStack>
                        <HStack spacing={1}>
                            <Icon as={FaComment} />
                            <Text fontSize="xs">{post.commentCount}</Text>
                        </HStack>
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    );
};

export default PostCard;