import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 0; i < totalPages; i++) {
        pages.push(i);
    }

    return (
        <HStack spacing={2} justify="center" my={8}>
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                isDisabled={currentPage === 0}
            >
                Previous
            </Button>
            {pages.map(pageNumber => (
                <Button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                    colorScheme={currentPage === pageNumber ? 'brand' : 'gray'}
                >
                    {pageNumber + 1}
                </Button>
            ))}
            <Button
                onClick={() => onPageChange(currentPage + 1)}
                isDisabled={currentPage === totalPages - 1}
            >
                Next
            </Button>
        </HStack>
    );
};

export default Pagination;