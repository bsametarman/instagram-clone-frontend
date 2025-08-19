import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    useColorModeValue,
    useColorMode,
    useDisclosure,
    Heading
} from '@chakra-ui/react';
import { FaMoon, FaRegSun } from 'react-icons/fa';
import { AddIcon } from '@chakra-ui/icons';
import CreatePostModal from '../post/CreatePostModal';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isLoggedIn, user, logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const bg = useColorModeValue('whiteAlpha.900', 'black');
    const borderColor = useColorModeValue('blue.500', 'blue.500');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePostCreated = (newPost) => {
        navigate(`/p/${newPost.id}`);
    };

    return (
        <>
            <Box
                bg={bg}
                borderBottom="1px"
                borderColor={borderColor}
                position="sticky"
                top={0}
                zIndex="sticky"
                backdropFilter="saturate(180%) blur(5px)"
            >
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    px={{ base: 4, md: 6 }}
                >
                    <HStack spacing={8} alignItems={'center'}>
                        <Heading as="h1" size="md">
                            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                                InstagramClone
                            </Link>
                        </Heading>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <HStack spacing={{ base: 2, md: 4 }}>
                            <HStack>
                                <Button as={RouterLink} to="/feed" size="sm" colorScheme="blue">
                                    Feed
                                </Button>
                                <Button as={RouterLink} to="/users" size="sm" colorScheme="blue">
                                    Users
                                </Button>
                                <IconButton
                                    icon={colorMode == "light" ? <FaMoon /> : <FaRegSun />}
                                    aria-label="Change theme"
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                    color={colorMode == "light" ? "black" : "white"}
                                    fontSize="18px"
                                    _hover={colorMode == "light" ? { bg: 'blue.200' } : { bg: 'whiteAlpha.300' }}
                                />
                                <IconButton
                                    icon={<AddIcon />}
                                    aria-label="Create Post"
                                    variant="ghost"
                                    onClick={onOpen}
                                />
                            </HStack>
                            {isLoggedIn ? (
                                <HStack spacing={4}>
                                    <Button
                                        as={RouterLink}
                                        to={`/profile/${user.username}`}
                                        variant="ghost"
                                        size="sm"
                                        colorScheme={"blue"}
                                    >
                                        {user.username}
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        variant="solid"
                                        size="sm"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </HStack>
                            ) : (
                                <HStack spacing={2}>
                                    <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                                        Log In
                                    </Button>
                                    <Button as={RouterLink} to="/signup" colorScheme="blue" variant="solid" size="sm">
                                        Sign Up
                                    </Button>
                                </HStack>
                            )}
                        </HStack>
                    </Flex>
                </Flex>
            </Box>

            <CreatePostModal
                isOpen={isOpen}
                onClose={onClose}
                onPostCreated={handlePostCreated}
            />
        </>
    );
};

export default Navbar;