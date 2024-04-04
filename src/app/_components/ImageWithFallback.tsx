import React, {useState, useEffect, FC} from 'react';
import Image, {ImageProps} from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    fallback: string;
    src: string;
}
const ImageWithFallback: FC<ImageWithFallbackProps> = ({ fallback, alt, src, ...props }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [src]);

    const handleError = () => {
        setHasError(true);
    };

    return (
        <Image
            alt={alt}
            onError={handleError}
            src={hasError ? fallback : src}
            data-loaded='false'
            onLoad={event => {
                event.currentTarget.setAttribute('data-loaded', 'true')
            }}
            className='data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10'
            {...props}
        />
    );
};

export default ImageWithFallback;
