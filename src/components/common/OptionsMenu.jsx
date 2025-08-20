import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    useToast,
    useColorMode
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

const OptionsMenu = ({ item, onDelete }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    const toast = useToast();

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete this ${item}?`)) {
            try {
                await onDelete();
                toast({
                    title: `${item} deleted.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: `Failed to delete ${item}.`,
                    description: error.response?.data?.message || 'You may not have permission.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots />}
                variant="ghost"
                size="sm"
                backgroundColor={colorMode == "light" ? "white" : "#1a1514"}
            />
            <MenuList>
                <MenuItem icon={<FaTrash />} color="red.500" onClick={onDelete}>
                    Delete
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default OptionsMenu;