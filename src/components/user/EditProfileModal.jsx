import React, { useState, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    Avatar,
    Center,
    Checkbox,
    useColorMode,
    FormHelperText,
    useToast
} from '@chakra-ui/react';
import userService from '../../api/userService';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
    const [formData, setFormData] = useState(
        {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            bio: user.bio || '',
            active: user.isActive || user.isActive,
        }
    );
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePictureUrl);
    const { colorMode, toggleColorMode } = useColorMode();
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (newProfilePic) {
                await userService.updateMyProfilePicture(newProfilePic);
            }

            const updatedProfileResponse = await userService.updateMyProfile(formData);

            toast({
                title: 'Profile updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onProfileUpdate(updatedProfileResponse.data);
            onClose();

        } catch (error) {
            console.error('Failed to update profile', error);
            toast({
                title: 'An error occurred.',
                description: 'Could not update your profile.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader backgroundColor={colorMode == "light" ? "white" : "#1a1514"}>Edit Your Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody backgroundColor={colorMode == "light" ? "white" : "#1a1514"}>
                    <VStack spacing={4}>
                        <FormControl>
                            <Center>
                                <VStack>
                                    <Avatar size="2xl" name={formData.name} src={previewUrl} />
                                    <Button size="sm" onClick={() => fileInputRef.current.click()}>
                                        Change Photo
                                    </Button>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        display="none"
                                    />
                                </VStack>
                            </Center>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Last Name</FormLabel>
                            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
                        </FormControl>

                        <FormControl>
                            <Checkbox
                                name="active"
                                colorScheme='blue'
                                isChecked={formData.active}
                                onChange={handleChange}
                            >
                                Public Account
                            </Checkbox>
                            <FormHelperText ml={4}>
                                When unchecked, your profile and posts will be private.
                            </FormHelperText>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter backgroundColor={colorMode == "light" ? "white" : "#1a1514"}>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;