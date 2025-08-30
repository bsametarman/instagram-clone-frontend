import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    HStack,
    Avatar,
    Text,
    Spinner,
    Center,
    Tabs,
    TabList,
    Tab,
    Box,
    Link,
    useColorMode,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import profileService from '../../api/profileService';

const FollowListModal = ({ isOpen, onClose, username, initialMode, followersCount, followingCount }) => {
    const [mode, setMode] = useState(initialMode);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();

    const handleTabsChange = (index) => {
        setMode(index === 0 ? 'followers' : 'following');
    };

    const observer = useRef();
    const lastUserElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchUsers(false);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


    const fetchUsers = useCallback(async (isNewTab) => {
        setLoading(true);
        const currentPage = isNewTab ? 0 : page;

        try {
            const apiCall = mode === 'followers'
                ? profileService.getFollowers(username, currentPage, 15)
                : profileService.getFollowing(username, currentPage, 15);

            const response = await apiCall;
            const newUsers = response.data.content;

            setList(prevList => isNewTab ? newUsers : [...prevList, ...newUsers]);
            setHasMore(!response.data.last);
            setPage(currentPage + 1);

        } catch (error) {
            console.error(`Failed to fetch ${mode}`, error);
        } finally {
            setLoading(false);
        }
    }, [mode, username, page]);

    useEffect(() => {
        if (isOpen) {
            setList([]);
            setPage(0);
            setHasMore(true);
            fetchUsers(true);
        }
    }, [mode, isOpen]);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside" size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader p={0} borderBottomWidth="1px" backgroundColor={colorMode == 'light' ? 'blue.100' : 'blackAlpha.800'}>
                    <Tabs index={mode === 'followers' ? 0 : 1} onChange={handleTabsChange} color={colorMode == 'light' ? 'black' : 'white'} isFitted>
                        <TabList>
                            <Tab>{followersCount} Followers</Tab>
                            <Tab>{followingCount} Following</Tab>
                        </TabList>
                    </Tabs>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody p={4} backgroundColor={colorMode == 'light' ? 'blue.50' : 'blackAlpha.600'}>
                    <VStack spacing={4} align="stretch">
                        {list.map((user, index) => (
                            <HStack
                                key={user.id}
                                ref={list.length === index + 1 ? lastUserElementRef : null}
                            >
                                <Avatar size="md" name={user.username} src={user.profilePictureUrl} />
                                <VStack align="flex-start" spacing={0}>
                                    <Link as={RouterLink} to={`/profile/${user.username}`} fontWeight="bold" onClick={onClose}>
                                        {user.username}
                                    </Link>
                                </VStack>
                            </HStack>
                        ))}

                        {loading && (
                            <Center py={4}>
                                <Spinner />
                            </Center>
                        )}

                        {!loading && list.length === 0 && (
                            <Center py={10}>
                                <Text color={colorMode == 'light' ? 'black' : 'white'}>No users to show.</Text>
                            </Center>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FollowListModal;