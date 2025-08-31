import React, { useState } from 'react';
import { Box, VStack, Heading, Text, useColorModeValue, Image, Flex, Center, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AvatarFallback = ({ name }) => {
    const getInitials = (nameStr) => {
        if (!nameStr) return '?';
        const words = nameStr.split(' ');
        if (words.length > 1 && words[0] && words[1]) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return nameStr.substring(0, 2).toUpperCase();
    };

    const fallbackBg = useColorModeValue('blue.400', 'blue.400');
    const fallbackColor = useColorModeValue('black', 'black');

    return (
        <Center
            w="100%"
            h="100%"
            bg={fallbackBg}
            color={fallbackColor}
        >
            <Heading size="3xl" fontWeight="semibold">
                {getInitials(name)}
            </Heading>
        </Center>
    );
};


const UserCard = ({ user }) => {
    const cardBg = useColorModeValue('white', '#120b06');
    const borderColor = useColorModeValue('blue.500', 'blue.500');
    const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
    const [imageError, setImageError] = useState(false);
    const displayName = user.fisrtName || user.username;

    return (
        <Box
            as={RouterLink}
            to={`/profile/${user.username}`}
            bg={cardBg}
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'xl',
            }}
        >

            <Box h="150px" w="full" bg="gray.200" position="relative">
                {imageError || !user.profilePictureUrl ? (
                    <AvatarFallback name={displayName} bgColor="blue" />
                ) : (
                    <Image
                        src={user.profilePictureUrl}
                        alt={displayName}
                        name={user.username}
                        objectFit="scale-down"
                        bgColor='black'
                        w="100%"
                        h="100%"
                        onError={() => setImageError(true)}
                    />
                )}
            </Box>

            <VStack p={4} spacing={2} align="flex-start">
                <Heading as="h3" size="md" noOfLines={1}>
                    {user.firstName} {user.lastName}
                </Heading>
                <Text color={subtleTextColor} fontSize="sm" mt="-1 !important">
                    @{user.username}
                </Text>
                <Tooltip label={user.bio} placement="bottom" hasArrow>
                    <Text fontSize="sm" noOfLines={2} minH="40px" color={subtleTextColor} >
                        {user.bio || 'No bio available.'}
                    </Text>
                </Tooltip>
            </VStack>
        </Box>
    );
};

export default UserCard;