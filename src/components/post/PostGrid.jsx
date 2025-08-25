import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { SimpleGrid, AspectRatio, Box, Image, Icon, useColorMode } from '@chakra-ui/react';
import { FaVideo } from 'react-icons/fa';

const PostGrid = ({ posts }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <SimpleGrid columns={{ base: 3 }} spacing={1}>
            {posts.map(post => (
                <RouterLink key={post.id} to={`/p/${post.id}`}>
                    <AspectRatio key={post.id} ratio={1}>
                        <Box position="relative" bg={colorMode == "light" ? "white" : "white"} cursor="pointer" _hover={{ opacity: 0.8 }}>
                            <Image
                                src={post.mediaUrl || post.imageUrl}
                                alt={post.imageUrl}
                                objectFit="scale-down"
                                w="100%"
                                h="100%"
                            />
                            {post.mediaType === 'VIDEO' && (
                                <Icon
                                    as={FaVideo}
                                    color="white"
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    boxSize={5}
                                />
                            )}
                        </Box>
                    </AspectRatio>
                </RouterLink>
            ))}
        </SimpleGrid>
    );
};

export default PostGrid;