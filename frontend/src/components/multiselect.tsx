import React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';

interface Options {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Options[];
    value: Options[];
    onChange: (value: Options[]) => void;
    placeholder: string;
}

const MultiSelectComponent: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
}) => {
    const handleChange = (selectedOptions: MultiValue<Options>, actionMeta: ActionMeta<Options>) => {
        if (selectedOptions) {
            onChange(selectedOptions as Options[]);
        } else {
            onChange([]);
        }
    };

    return (
        <Select
            options={options}
            value={value}
            onChange={handleChange}
            isMulti
            placeholder={placeholder}
        />
    );
};

export default MultiSelectComponent;
