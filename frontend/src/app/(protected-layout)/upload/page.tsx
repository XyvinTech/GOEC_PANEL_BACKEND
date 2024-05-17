"use client"


import ExcelDropzone from "@/components/excel-dropzone";
import Header from "@/components/header";
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { bulkUpload, selectStatus } from "@/lib/features/chargingStations/stationSlice";




const page = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const apiStatus = useAppSelector(selectStatus)




    const handleFileAccepted = (file: File) => {
        console.log(file);
        setSelectedFile(file);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
    };


    const handleSave = () => {
        if (selectedFile) {
            console.log('Saving file:', selectedFile.name);

            dispatch(bulkUpload(selectedFile));
            if (apiStatus === 'idle') {
                setSelectedFile(null);

            }

        } else {
            console.log('No file selected');

        }
    };
    return (
        <div>
            <Header />
            <div className="p-8 flex flex-col">
                <p className="font-semibold text-xl py-5">Upload </p>

                <ExcelDropzone
                    file={null}
                    setFile={handleFileAccepted}
                    clearFile={handleClearFile}
                    fileName={selectedFile?.name}
                />
                <div className='flex justify-between mt-10'>
                    <Button
                        variant='outline'
                        className='bg-transparent border-2 border-red-500 text-red-500'
                        type='button'
                        onClick={handleClearFile}
                    >
                        Cancel
                    </Button>
                    <Button type='button' onClick={handleSave}>Save</Button>
                </div>
            </div>

        </div>
    );
};

export default page;
