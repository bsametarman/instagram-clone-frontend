import React from 'react';
import {
    Box,
    Flex,
    Avatar,
    Heading,
    Text,
    HStack,
    VStack,
    Button,
    useDisclosure,
    useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from './EditProfileModal';

const ProfileHeader = ({ profileUser, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const isOwnProfile = currentUser?.id === profileUser?.id;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const statLabelColor = useColorModeValue('blue.500', 'black');

    const Stat = ({ label, value }) => (
        <VStack spacing={0}>
            <Text fontWeight="bold" fontSize="lg">{value}</Text>
            <Text fontSize="sm" color={statLabelColor}>{label}</Text>
        </VStack>
    );

    return (
        <>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                justify="center"
                p={8}
                bg={useColorModeValue('gray.50', 'blue.600')}
                borderRadius="lg"
                w="100%"
            >
                <Avatar
                    size="2xl"
                    name={profileUser.firstName || profileUser.username}
                    src={profileUser.profilePictureUrl}
                    border="4px"
                    borderColor={useColorModeValue('blue.500', 'blue.500')}
                    boxShadow="lg"
                    mr={{ base: 0, md: 8 }}
                    mb={{ base: 4, md: 0 }}
                />

                <VStack spacing={4} align={{ base: 'center', md: 'flex-start' }}>
                    <Flex align="center" direction={{ base: 'column', md: 'row' }}>
                        <Heading as="h1" size="lg" mr={{ md: 4 }}>{profileUser.username}</Heading>
                        {isOwnProfile && (
                            <Button size="sm" variant="outline" onClick={onOpen}>Edit Profile</Button>
                        )}
                    </Flex>

                    <HStack spacing={8}>
                        <Stat value={profileUser.postCount} label="Posts" />
                        <Stat value={profileUser.followerCount || 0} label="Followers" />
                        <Stat value={profileUser.followingCount || 0} label="Following" />
                    </HStack>

                    <VStack spacing={1} align={{ base: 'center', md: 'flex-start' }}>
                        <Text fontWeight="bold">{profileUser.firstName} {profileUser.lastName}</Text>
                        <Text textAlign={{ base: 'center', md: 'left' }} fontWeight="light">{profileUser.bio != null ? profileUser.bio : 'user did not specify bio'}</Text>
                    </VStack>
                </VStack>
            </Flex>
            {isOwnProfile && (
                <EditProfileModal
                    isOpen={isOpen}
                    onClose={onClose}
                    user={profileUser}
                    onProfileUpdate={onProfileUpdate}
                />
            )}
        </>
    );
};

export default ProfileHeader;