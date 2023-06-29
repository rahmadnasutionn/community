import useImageOnLoad from "@/hooks/useImageOnLoad"
import Image from "next/image";
import { CSSProperties } from "react";
import Spinner from "./ui/spinner";

interface ProgressiveImageProps {
  src: any;
};

function ProgressiveImage({ src }: ProgressiveImageProps) {
  const { handleImageOnLoad, css } = useImageOnLoad();

  const style: { [key: string]: CSSProperties } = {
    wrap: {
      position: 'relative',
      width: 400,
      height: 400,
      margin: 'auto',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `100%`,
      height: `100%`,
    },
  };

  return (
    <div style={style.wrap}>
          <Image 
            fill
            style={{ ...style.image, ...(css.thumbnail as CSSProperties) }}
            src={src}
            alt={`image-${src}`}
          />
          <Image 
            fill
            onLoad={handleImageOnLoad}
            src={src}
            style={{ ...style.image, ...(css.fullSize as CSSProperties) }}
            alt={`image-${src}`}
          />
    </div>
  )
}

export default ProgressiveImage