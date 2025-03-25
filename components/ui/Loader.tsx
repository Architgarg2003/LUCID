import React from 'react';
import { jellyTriangle } from 'ldrs';
import { useLoader } from '@/app/LoaderContext';

jellyTriangle.register();

const Loader: React.FC = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75'>
            <l-jelly-triangle
                size="60"
                speed="1.75"
                color="#4F2FA0"
            ></l-jelly-triangle>
        </div>
    );
};

export default Loader;