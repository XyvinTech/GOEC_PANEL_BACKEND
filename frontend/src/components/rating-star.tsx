"use client"

import React, { useState } from 'react';
import { Star } from 'lucide-react';


interface RatingComponentProps {
    maxRating?: number;
    initialRating?: number;
    onRatingChange?: (rating: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
    maxRating = 5,
    initialRating = 0,
    onRatingChange,
}) => {
    const [rating, setRating] = useState(initialRating);

    const handleStarClick = (selectedRating: number) => {
        setRating(selectedRating);
        if (onRatingChange) {
            onRatingChange(selectedRating);
        }
    };

    const starIcons: JSX.Element[] = [];

    // Loop through the maximum rating and generate star icons accordingly
    for (let i = 1; i <= maxRating; i++) {
        starIcons.push(
            <Star
                key={i}
                size={24}
                onClick={() => handleStarClick(i)}
                color={i <= rating ? 'gold' : 'gray'}
                style={{ cursor: 'pointer' }}
            />
        );
    }

    return (
        <div className='flex'>{starIcons}</div>
    );
};

// interface StarProps {
//     filled: boolean;
//     onClick: () => void;
// }

// const Star: React.FC<StarProps> = ({ filled, onClick }) => {
//     return (
//         <span
//             className={`text-yellow-400 cursor-pointer ${filled ? 'fas' : 'far'} fa-star`}
//             onClick={onClick}
//         ></span>
//     );
// };

export default RatingComponent;
