import React from "react";
import { useDropzone } from "react-dropzone";
import { FilePlus, Trash2 } from "lucide-react";

type ExcelDropzoneProps = {
    setFile: (file: File) => void;
    clearFile: () => void;
    file: File | null;
    fileName?: string; // Display the name of the file if it's already been uploaded
};

const ExcelDropzone = ({ file, setFile, clearFile, fileName }: ExcelDropzoneProps) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFile(file);
            }
        },
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
            "text/csv": [".csv"],
        },
        multiple: false,
    });

    return (
        <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            <input {...getInputProps()} />
            {file || fileName ? (
                <div className="flex flex-col items-center p-4">
                    <span className="text-sm font-medium">
                        {file?.name || fileName}
                    </span>
                    <Trash2
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the dropzone from opening the file dialog
                            clearFile();
                        }}
                        size={24}
                        color="#e63946"
                        className="cursor-pointer mt-2"
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center p-4">
                    <FilePlus size={24} className="mb-2" />
                    <p className="text-sm font-medium">Drag 'n' drop an Excel file here, or click to select files</p>
                    <p className="text-xs text-gray-500">Accepts .xlsx, .xls, .csv files. Up to 10MB.</p>
                </div>
            )}
        </div>
    );
};

export default ExcelDropzone;
