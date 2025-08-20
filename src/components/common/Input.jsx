import React from 'react';

const Input = ({ id, name, type = 'text', placeholder, value, onChange, ...props }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
        />
    );
};

export default Input;