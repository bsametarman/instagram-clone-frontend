import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button, FormControl, FormLabel, Textarea, Select, VStack, Image, Box, AspectRatio, useToast,
    Center, Input, Text, useColorMode,
} from '@chakra-ui/react';
import postService from '../../api/postService';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mediaType, setMediaType] = useState('IMAGE');
    const [isLoading, setIsLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            if (selectedFile.type.startsWith('image/')) {
                setMediaType('IMAGE');
            } else if (selectedFile.type.startsWith('video/')) {
                setMediaType('VIDEO');
            }

            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setHashtags('');
        setFile(null);
        setPreview(null);
        setIsLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!file) {
            toast({
                title: "No file selected.",
                description: "Please select an image or video to upload.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        const postData = {
            mediaType,
            description: description,
            title: title,
            hashtags: hashtags.split(',').map(h => h.trim()).filter(h => h),
        };

        try {
            const response = await postService.createPost(file, postData);

            toast({
                title: "Post created successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onPostCreated(response.data);
            handleClose();
        } catch (error) {
            console.error("Failed to create post", error);
            toast({
                title: "An error occurred.",
                description: error.response?.data?.message || "Could not create your post.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader backgroundColor={colorMode == "light" ? "white" : "#1a1514"} >Create a New Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody backgroundColor={colorMode == "light" ? "white" : "#1a1514"}>
                    <VStack spacing={4}>
                        <Box w="full" h="300px" bg="blue.500" borderRadius="md" borderWidth="2px" borderStyle="dashed">
                            {preview ? (
                                mediaType === 'IMAGE' ? (
                                    <Image src={preview} alt="Preview" w="full" h="full" objectFit="contain" />
                                ) : (
                                    <AspectRatio ratio={16 / 9} w="full" h="full">
                                        <video src={preview} controls style={{ width: '100%', height: '100%' }} />
                                    </AspectRatio>
                                )
                            ) : (
                                <Center h="full">
                                    <Text color="black">Image or Video Preview</Text>
                                </Center>
                            )}
                        </Box>

                        <FormControl>
                            <Input type="file" accept="image/*,video/*" onChange={handleFileChange} p={1} />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Textarea
                                placeholder="Write a title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Write a description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Hashtags (comma separated)</FormLabel>
                            <Input
                                placeholder="e.g. travel, nature, public"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter backgroundColor={colorMode == "light" ? "white" : "#1a1514"}>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
                        Share
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreatePostModal;