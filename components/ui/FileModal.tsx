// components/Modal.tsx
import React, { ChangeEvent, DragEvent, useState } from 'react';
import { FileText } from 'lucide-react';
import { X } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Trash2 } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (uploadedFiles: FileList | null) => void;
    ResumeFiles: any
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onUpload, ResumeFiles }) => {
    if (!isOpen) return null;

    const [dragging, setDragging] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onUpload(event.target.files);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files) {
            onUpload(event.dataTransfer.files);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="flex w-[70vw] h-[70vh] bg-white rounded-lg shadow-lg relative">
                {/* File List */}
                <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
                    <div className="space-y-4">
                        {ResumeFiles.length === 0 ? (
                            <p>No files available</p>
                        ) : (
                            ResumeFiles?.map((file: any, index: any) => (
                                <div key={index}>
                                    <StackCard file={file} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Dropzone for File Upload */}
                <div
                    className={`w-1/2 p-4 ${dragging ? 'border-2 border-[#7C3AED]' : 'border-2 border-gray-300'} rounded-lg flex flex-col items-center justify-center`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
                    <div className="w-full h-[60%] flex flex-col items-center justify-center border-dashed border-4 rounded-lg p-6 bg-gray-100">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="cursor-pointer gap-5 w-full h-full flex flex-col items-center justify-center text-gray-600"
                        >
                            <FileText height={40} width={40} />
                            <p>Drag & drop files here or click to select</p>
                        </label>
                    </div>
                </div>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                >
                    <X height={20} width={20} />
                </button>
            </div>
        </div>
    );
};

export default Modal;





const StackCard = ({ file }: any) => {

    const url = useQuery(api.fetchFiles.getFileUrl, { fileId: file._id })
    const delet = useMutation(api.fetchFiles.deleteFile);
    console.log("url", url?.url);

    const handleDelete = async (fileId: any) => {
        await delet({ fileId: fileId })
    }


    return (

        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
            <div className="flex items-center justify-between space-x-4">
                <a className='flex flex-row items-center justify-center gap-3 space-x-4' target="_blank" href={url?.url || ''}>
                    <div className='flex items-center justify-center bg-[#7C3AED] p-5 rounded-lg'>
                        <FileText width={20} height={20} color='white' />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium">{file.fileName}</h3>
                        {/* <p className="text-xs text-gray-500">{file.}</p> */}
                    </div>
                </a>
                <div className='bg-red-500 p-2 rounded-lg cursor-pointer' onClick={() => handleDelete(file._id)}>
                    <Trash2 color='white' height={15} width={15} />
                </div>
            </div>
        </div>
    )
}
