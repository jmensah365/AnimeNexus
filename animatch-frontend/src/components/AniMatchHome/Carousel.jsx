import React, { useEffect, useState } from 'react';
import { CaretCircleLeftIcon, CaretCircleRightIcon } from '@phosphor-icons/react';

function Carousel({ children: images, autoSlide=false, autoSlideInterval=3000 }) {
    const [curr, setCurr] = useState(0);

    // Ensure images is an array
    const imageArray = React.Children.toArray(images);

    const prev = () => setCurr((curr) => (curr === 0 ? imageArray.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === imageArray.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval)
        return () => clearInterval(slideInterval);
    },[])

    return (
        <div className="overflow-hidden relative w-auto">
            {/* Carousel Container */}
            <div
                className="flex transition-transform ease-out duration-500"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {imageArray.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        {image}
                    </div>
                ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button onClick={prev} className="cursor-pointer p-1 hover:text-gray-400">
                    <CaretCircleLeftIcon size={40} />
                </button>
                <button onClick={next} className="cursor-pointer p-1 hover:text-gray-400">
                    <CaretCircleRightIcon size={40} />
                </button>
            </div>
            <div className='absolute top-2 right-0 left-0'>
                <div className='flex items-center justify-center gap-2'>
                    {imageArray.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full border-2 border-white ${curr === index ? 'bg-white' : 'bg-black'}`}
                            onClick={() => setCurr(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carousel;
