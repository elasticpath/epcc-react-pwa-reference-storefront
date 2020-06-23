import React, {
  useEffect,
  useState,
} from 'react';

interface ImageContainerProps {
  imgUrl: string;
  imgClassName?: string;
  alt: string,
  imageStyle?: any,
}

export const ImageContainer: React.FC<ImageContainerProps> = (props) => {
  const {
    imgUrl, imgClassName, alt, imageStyle,
  } = props;

  const imgAlt = alt != null ? alt : '';
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [imageRef, setImageRef] = useState<any>();

  useEffect(
    () => {
      let observer:any;
      let didCancel = false;
      if (imageRef && imageSrc !== imgUrl) {
        if (IntersectionObserver) {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (
                  !didCancel
                  && (entry.intersectionRatio > 0 || entry.isIntersecting)
                ) {
                  setImageSrc(imgUrl);
                  observer.unobserve(imageRef);
                }
              });
            },
            {
              threshold: 0,
            },
          );
          observer.observe(imageRef);
        } else {
          setImageSrc(imgUrl);
        }
      }
      return () => {
        didCancel = true;
        if (observer && observer.unobserve) {
          observer.unobserve(imageRef);
        }
      };
    },
    [imgUrl, imageSrc, imageRef],
  );

  const handlePictureError = () => {
    setError(true);
  };

  if (!error) {
    return (<img style={imageStyle} className={imgClassName} ref={setImageRef} alt={imgAlt} src={imageSrc} onError={() => handlePictureError()} />);
  }
  return null;
};

ImageContainer.defaultProps = {
  imgClassName: '',
  imageStyle: {},
};
