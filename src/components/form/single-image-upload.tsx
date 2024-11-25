"use client";
import { useDropzone } from "react-dropzone";

interface SingleImageUploadProps {
  file?: string | File;
  setFile: (file: string | File) => void;
  label?: string | React.ReactNode
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  file,
  setFile,
  label
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024,
    maxFiles: 1,
  });
  return (
    <div>
        <p className="text-sm">{label}</p>
      <div
        {...getRootProps()}
        className="border rounded border-dashed flex flex-col  justify-center items-center space-x-3 p-3"
      >
        <input {...getInputProps} className="w-0 h-0"></input>
        {isDragActive ? (
          <p>Drop image here</p>
        ) : (
          <p>Drag and drop some image here or click here to select image </p>
        )}
      </div>
    </div>
  );
};

export default SingleImageUpload;
