"use client";

import Image from "next/image";
import { Button } from "../ui/button";

interface ImageRenderProps {
  image: string | File;
  setImage: (image: string | File |undefined) => void;
}

const ImageRender: React.FC<ImageRenderProps> = ({ image, setImage }) => {
  return (
    <div className="flex flex-col gap-3">
      <Image
      unoptimized
        width={400}
        height={400}
        alt="image"
        src={typeof image === "string" ? image : URL.createObjectURL(image)}
        className="  w-52 h-52 object-cover"
      ></Image>
      <Button onClick={()=>(setImage(undefined))} variant={"destructive"}>Remove</Button>
    </div>
  );
};

export default ImageRender;
