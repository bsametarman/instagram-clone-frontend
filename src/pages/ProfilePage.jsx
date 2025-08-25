import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Spinner,
    Alert,
    AlertIcon,
    Center,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    VStack,
    Flex,
    Select,
    useColorMode,
    Heading,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import postService from '../api/postService';
import useDebounce from '../hooks/useDebounce';
import ProfileHeader from '../components/user/ProfileHeader';
import PostGrid from '../components/post/PostGrid';
import profileService from './../api/profileService';

const ProfilePage = () => {
    const { username } = useParams();
    const { colorMode, toggleColorMode } = useColorMode();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sort, setSort] = useState('createdAt,desc');
    const [profileLoading, setProfileLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [error, setError] = useState(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setProfileLoading(true);
            setError(null);
            try {
                const response = await profileService.getUserProfile(username);
                setProfileUser(response.data);
            } catch (err) {
                setError('User not found or failed to load profile.');
            } finally {
                setProfileLoading(false);
            }
        };
        fetchUserProfile();
    }, [username]);

    const handleProfileUpdate = (updatedUserData) => {
        setProfileUser(prevUser => ({
            ...prevUser,
            ...updatedUserData,
        }));
    };

    const fetchPosts = useCallback(async (isNewQuery) => {
        if (postsLoading || (!hasMore && !isNewQuery)) return;

        setPostsLoading(true);

        const mediaType = activeTab === 0 ? 'IMAGE' : 'VIDEO';
        const currentPage = isNewQuery ? 0 : page;

        if (isNewQuery) {
            setPosts([]);
            setHasMore(true);
        }

        try {
            const response = await postService.getPostsByUser(username, {
                mediaType,
                searchTerm: debouncedSearchTerm,
                page: currentPage,
                size: 9,
                sort: sort,
            });

            const newPosts = response.data.content;
            setPosts(prevPosts => isNewQuery ? newPosts : [...prevPosts, ...newPosts]);
            setPage(currentPage + 1);
            setHasMore(!response.data.last);

        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Could not load posts.");
        } finally {
            setPostsLoading(false);
        }
    }, [username, activeTab, debouncedSearchTerm, page, hasMore, postsLoading, sort]);

    useEffect(() => {
        if (!profileLoading) {
            fetchPosts(true);
        }
    }, [activeTab, debouncedSearchTerm, profileLoading, sort]);

    if (profileLoading) return <Center h="80vh"><Spinner size="xl" /></Center>;
    if (error && !profileUser) return <Container mt={8}><Alert status="error"><AlertIcon />{error}</Alert></Container>;

    return (
        <Container maxW="container.lg" py={8}>
            {profileUser && <ProfileHeader profileUser={profileUser} onProfileUpdate={handleProfileUpdate} />}

            <Flex my={8} direction={{ base: 'column', md: 'row' }} gap={4}>
                <Box flex="1">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color={"blue"} />
                        </InputLeftElement>
                        <Input
                            placeholder={`Search in ${username}'s content...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Box>
                <Select
                    w={{ base: 'full', md: '200px' }}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="createdAt,desc">Newest First</option>
                    <option value="createdAt,asc">Oldest First</option>
                    <option value="likeCount,desc">Most Liked</option>
                    <option value="commentCount,desc">Most Commented</option>
                </Select>
            </Flex>

            <Tabs index={activeTab} onChange={(index) => setActiveTab(index)} isFitted variant="enclosed" colorScheme="blue">
                <TabList>
                    <Tab>Photos</Tab>
                    <Tab>Videos</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel p={0} pt={4}>
                        {posts.length > 0 ? (
                            <PostGrid posts={posts} />
                        ) : (
                            !postsLoading && (
                                <Center p={10}>
                                    <VStack>
                                        <Heading size="md" color="gray.500">No content found.</Heading>
                                        <Text color="gray.500">This user hasn't posted anything that matches your search yet.</Text>
                                    </VStack>
                                </Center>
                            )
                        )}
                    </TabPanel>
                    <TabPanel p={0} pt={4}>
                        {posts.length > 0 ? (
                            <PostGrid posts={posts} />
                        ) : (
                            !postsLoading && (
                                <Center p={10}>
                                    <VStack>
                                        <Heading size="md" color="gray.500">No content found.</Heading>
                                        <Text color="gray.500">This user hasn't posted anything that matches your search yet.</Text>
                                    </VStack>
                                </Center>
                            )
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {postsLoading && <Center my={4}><Spinner /></Center>}

            {hasMore && !postsLoading && (
                <Center mt={8}>
                    <Button onClick={() => fetchPosts(false)} colorScheme="blue" variant="outline">
                        Load More
                    </Button>
                </Center>
            )}
        </Container>
    );
};

export default ProfilePage;