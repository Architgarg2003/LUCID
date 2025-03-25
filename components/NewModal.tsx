

// "use client"

// import { useState, useRef, FormEvent } from 'react'
// import { useMutation, useQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Plus, Upload } from "lucide-react"
// import { Button } from "./ui/button"
// import { pdfToText } from 'pdf-ts'
// import { useAuth } from '@clerk/clerk-react'

// interface NewModalI {
//     setJd: (e: any) => void,
//     setResume: (e: any) => void,
//     setJobTitle: (e: any) => void,
//     setDifficulty: (e: any) => void,
//     setCompanyName: (e: any) => void,
//     handleGenerateMCQ: () => void,
//     isInterview?: boolean
// }

// const NewModal = ({ isInterview, handleGenerateMCQ, setJd, setResume, setJobTitle, setDifficulty, setCompanyName }: NewModalI) => {
//     const { userId } = useAuth() as { userId: string };
//     const [open, setOpen] = useState(false);
//     const [file, setFile] = useState<File | null>(null)
//     const [uploading, setUploading] = useState(false)
//     const [selectedResume, setSelectedResume] = useState<string>('')
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const generateUploadUrl = useMutation(api.uploadPdF.generateUploadUrl)
//     const saveFile = useMutation(api.uploadPdF.saveFile)
//     const getUserResumes = useQuery(api.fetchFiles.FetchResumeFiles, { userId })

//     const handleStart = () => {
//         handleGenerateMCQ();
//         setOpen(false)
//     }

//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//             try {
//                 const fileBuffer = await file.arrayBuffer()
//                 const parsedText = await pdfToText(new Uint8Array(fileBuffer))
//                 console.log(parsedText)
//                 setter(parsedText)
//                 setFile(file)
//             } catch (error) {
//                 console.error("Error parsing PDF:", error)
//             }
//         }
//     }

//     const handleResumeSelection = (value: string) => {
//         if (value === 'upload') {
//             fileInputRef.current?.click()
//         } else {
//             setSelectedResume(value)
//             // Here you would typically fetch the content of the selected resume
//             // and set it using setResume(fetchedResumeContent)
//         }
//     }

//     const handleSubmit = async (event: FormEvent) => {
//         event.preventDefault()
//         if (!file) return
//         setUploading(true)
//         try {
//             const postUrl = await generateUploadUrl()
//             const result = await fetch(postUrl, {
//                 method: 'POST',
//                 headers: { 'Content-Type': file.type },
//                 body: file,
//             })
//             const { storageId } = await result.json();
//             await saveFile({ storageId, userId, fileName: file.name, fileType: file.type })
//             if (fileInputRef.current) fileInputRef.current.value = ''
//             handleStart();
//         } catch (error) {
//             console.error('Error uploading file:', error)
//             alert('Error uploading file. Please try again.')
//         } finally {
//             setUploading(false)
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     className='bg-black rounded-full text-white capitalize inline-flex text-sm sm:text-base mt-4 md:mt-0 mr-2 md:mr-0'
//                     size="sm"
//                 >
//                     create new
//                     <Plus className="w-4 h-4 ml-2" />
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="md:w-[40vw] w-[95vw] max-w-[90rem] h-[90vh] overflow-y-auto p-4 sm:p-6">
//                 <DialogHeader>
//                     <DialogTitle className="text-xl sm:text-2xl">Create New {isInterview ? "Interview" : "Test"}</DialogTitle>
//                     <DialogDescription className="text-sm sm:text-base">
//                         Create a custom {isInterview ? "interview" : "test"} tailored just for you using AI.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//                     <div className='space-y-2'>
//                         <Label htmlFor="jobTitle" className="text-sm sm:text-base">
//                             Job Title
//                         </Label>
//                         <Input
//                             id="jobTitle"
//                             className="w-full"
//                             onChange={(e) => setJobTitle(e.target.value)}
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="companyName" className="text-sm sm:text-base">
//                             Company Name
//                         </Label>
//                         <Input
//                             id="companyName"
//                             className="w-full"
//                             onChange={(e) => setCompanyName(e.target.value)}
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="jobDescription" className="text-sm sm:text-base">
//                             Job Description
//                         </Label>
//                         <Input
//                             accept="application/pdf"
//                             id="jobDescription"
//                             type="file"
//                             onChange={(e) => handleFileUpload(e, setJd)}
//                             className="w-full"
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="resume" className="text-sm sm:text-base">
//                             Resume
//                         </Label>
//                         <Select onValueChange={handleResumeSelection}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select a resume" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {getUserResumes?.map((resume, index) => (
//                                     <SelectItem key={index} value={resume._id}>
//                                         {resume.fileName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         <Input
//                             accept="application/pdf"
//                             id="resume"
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={(e) => handleFileUpload(e, setResume)}
//                             className="w-full mt-2"
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="difficulty" className="text-sm sm:text-base">
//                             Difficulty Level
//                         </Label>
//                         <Select onValueChange={setDifficulty}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="easy">Easy</SelectItem>
//                                     <SelectItem value="medium">Medium</SelectItem>
//                                     <SelectItem value="hard">Hard</SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <DialogFooter>
//                         <Button
//                             type="submit"
//                             className="bg-[#141414] rounded-full text-white p-2 sm:p-3 text-sm sm:text-base w-full sm:w-auto"
//                             disabled={uploading}
//                         >
//                             {uploading ? 'Uploading...' : 'Upload and Start'}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default NewModal










// "use client"

// import { useState, useRef, FormEvent } from 'react'
// import { useMutation, useQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Plus, Upload } from "lucide-react"
// import { Button } from "./ui/button"
// import { pdfToText } from 'pdf-ts'
// import { useAuth } from '@clerk/clerk-react'

// interface NewModalI {
//     setJd: (e: any) => void,
//     setResume: (e: any) => void,
//     setJobTitle: (e: any) => void,
//     setDifficulty: (e: any) => void,
//     setCompanyName: (e: any) => void,
//     handleGenerateMCQ: () => void,
//     isInterview?: boolean
// }

// const NewModal = ({ isInterview, handleGenerateMCQ, setJd, setResume, setJobTitle, setDifficulty, setCompanyName }: NewModalI) => {
//     const { userId } = useAuth() as { userId: string };
//     const [open, setOpen] = useState(false);
//     const [resumeFile, setResumeFile] = useState<File | null>(null)
//     const [jdFile, setJdFile] = useState<File | null>(null)
//     const [uploading, setUploading] = useState(false)
//     const [selectedResume, setSelectedResume] = useState<string>('')
//     const resumeFileInputRef = useRef<HTMLInputElement>(null)
//     const jdFileInputRef = useRef<HTMLInputElement>(null)

//     const generateUploadUrl = useMutation(api.uploadPdF.generateUploadUrl)
//     const saveFile = useMutation(api.uploadPdF.saveFile)
//     const getUserResumes = useQuery(api.fetchFiles.FetchResumeFiles, { userId })

//     const handleStart = () => {
//         handleGenerateMCQ();
//         setOpen(false)
//     }

//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, isResume: boolean) => {
//         const file = e.target.files?.[0]
//         if (file) {
//             try {
//                 const fileBuffer = await file.arrayBuffer()
//                 const parsedText = await pdfToText(new Uint8Array(fileBuffer))
//                 console.log(parsedText)
//                 setter(parsedText)
//                 if (isResume) {
//                     setResumeFile(file)
//                 } else {
//                     setJdFile(file)
//                 }
//             } catch (error) {
//                 console.error("Error parsing PDF:", error)
//             }
//         }
//     }

//     const handleResumeSelection = (value: string) => {
//         if (value === 'upload') {
//             resumeFileInputRef.current?.click()
//         } else {
//             setSelectedResume(value)
//             // Here you would typically fetch the content of the selected resume
//             // and set it using setResume(fetchedResumeContent)
//         }
//     }

//     const uploadFile = async (file: File) => {
//         const postUrl = await generateUploadUrl()
//         const result = await fetch(postUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': file.type },
//             body: file,
//         })
//         return await result.json()
//     }

//     const handleSubmit = async (event: FormEvent) => {
//         event.preventDefault()
//         if (!resumeFile && !jdFile) return
//         setUploading(true)
//         try {
//             // Upload resume file and save to database
//             if (resumeFile) {
//                 const { storageId } = await uploadFile(resumeFile)
//                 await saveFile({ storageId, userId, fileName: resumeFile.name, fileType: resumeFile.type })
//                 if (resumeFileInputRef.current) resumeFileInputRef.current.value = ''
//             }

//             // Upload JD file but don't save to database
//             if (jdFile) {
//                 await uploadFile(jdFile)
//                 if (jdFileInputRef.current) jdFileInputRef.current.value = ''
//             }

//             handleStart();
//         } catch (error) {
//             console.error('Error uploading file:', error)
//             alert('Error uploading file. Please try again.')
//         } finally {
//             setUploading(false)
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     className='bg-black rounded-full text-white capitalize inline-flex text-sm sm:text-base mt-4 md:mt-0 mr-2 md:mr-0'
//                     size="sm"
//                 >
//                     create new
//                     <Plus className="w-4 h-4 ml-2" />
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="md:w-[40vw] w-[95vw] max-w-[90rem] h-[90vh] overflow-y-auto p-4 sm:p-6">
//                 <DialogHeader>
//                     <DialogTitle className="text-xl sm:text-2xl">Create New {isInterview ? "Interview" : "Test"}</DialogTitle>
//                     <DialogDescription className="text-sm sm:text-base">
//                         Create a custom {isInterview ? "interview" : "test"} tailored just for you using AI.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//                     <div className='space-y-2'>
//                         <Label htmlFor="jobTitle" className="text-sm sm:text-base">
//                             Job Title
//                         </Label>
//                         <Input
//                             id="jobTitle"
//                             className="w-full"
//                             onChange={(e) => setJobTitle(e.target.value)}
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="companyName" className="text-sm sm:text-base">
//                             Company Name
//                         </Label>
//                         <Input
//                             id="companyName"
//                             className="w-full"
//                             onChange={(e) => setCompanyName(e.target.value)}
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="jobDescription" className="text-sm sm:text-base">
//                             Job Description
//                         </Label>
//                         <Input
//                             accept="application/pdf"
//                             id="jobDescription"
//                             type="file"
//                             ref={jdFileInputRef}
//                             onChange={(e) => handleFileUpload(e, setJd, false)}
//                             className="w-full"
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="resume" className="text-sm sm:text-base">
//                             Resume
//                         </Label>
//                         <Select onValueChange={handleResumeSelection}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select a resume" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {getUserResumes?.map((resume, index) => (
//                                     <SelectItem key={index} value={resume._id}>
//                                         {resume.fileName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         <Input
//                             accept="application/pdf"
//                             id="resume"
//                             type="file"
//                             ref={resumeFileInputRef}
//                             onChange={(e) => handleFileUpload(e, setResume, true)}
//                             className="w-full mt-2"
//                         />
//                     </div>
//                     <div className='space-y-2'>
//                         <Label htmlFor="difficulty" className="text-sm sm:text-base">
//                             Difficulty Level
//                         </Label>
//                         <Select onValueChange={setDifficulty}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="easy">Easy</SelectItem>
//                                     <SelectItem value="medium">Medium</SelectItem>
//                                     <SelectItem value="hard">Hard</SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <DialogFooter>
//                         <Button
//                             type="submit"
//                             className="bg-[#141414] rounded-full text-white p-2 sm:p-3 text-sm sm:text-base w-full sm:w-auto"
//                             disabled={uploading}
//                         >
//                             {uploading ? 'Uploading...' : 'Upload and Start'}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default NewModal



"use client"

import { useState, useRef, FormEvent } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { pdfToText } from 'pdf-ts'
import { useAuth } from '@clerk/clerk-react'

interface NewModalI {
    setJd: (e: any) => void,
    setResume: (e: any) => void,
    setJobTitle: (e: any) => void,
    setDifficulty: (e: any) => void,
    setCompanyName: (e: any) => void,
    handleGenerateMCQ: () => void,
    isInterview?: boolean
}

const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
)

const NewModal = ({ isInterview, handleGenerateMCQ, setJd, setResume, setJobTitle, setDifficulty, setCompanyName }: NewModalI) => {
    const { userId } = useAuth() as { userId: string };
    const [open, setOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [jdFile, setJdFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [selectedResume, setSelectedResume] = useState<string>('')
    const resumeFileInputRef = useRef<HTMLInputElement>(null)
    const jdFileInputRef = useRef<HTMLInputElement>(null)

    const generateUploadUrl = useMutation(api.uploadPdF.generateUploadUrl)
    const saveFile = useMutation(api.uploadPdF.saveFile)
    const getUserResumes = useQuery(api.fetchFiles.FetchResumeFiles, { userId })

    const handleStart = () => {
        handleGenerateMCQ();
        setOpen(false)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, isResume: boolean) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const fileBuffer = await file.arrayBuffer()
                const parsedText = await pdfToText(new Uint8Array(fileBuffer))
                console.log(parsedText)
                setter(parsedText)
                if (isResume) {
                    setResumeFile(file)
                } else {
                    setJdFile(file)
                }
            } catch (error) {
                console.error("Error parsing PDF:", error)
            }
        }
    }

    const handleResumeSelection = (value: string) => {
        if (value === 'upload') {
            resumeFileInputRef.current?.click()
        } else {
            setSelectedResume(value)
            // Here you would typically fetch the content of the selected resume
            // and set it using setResume(fetchedResumeContent)
        }
    }

    const uploadFile = async (file: File) => {
        const postUrl = await generateUploadUrl()
        const result = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
        })
        return await result.json()
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!resumeFile && !jdFile) return
        setUploading(true)
        try {
            // Upload resume file and save to database
            if (resumeFile) {
                const { storageId } = await uploadFile(resumeFile)
                await saveFile({ storageId, userId, fileName: resumeFile.name, fileType: resumeFile.type })
                if (resumeFileInputRef.current) resumeFileInputRef.current.value = ''
            }

            // Upload JD file but don't save to database
            if (jdFile) {
                await uploadFile(jdFile)
                if (jdFileInputRef.current) jdFileInputRef.current.value = ''
            }

            handleStart();
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Error uploading file. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            {uploading && <LoadingSpinner />}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        className='bg-black rounded-full text-white capitalize inline-flex text-sm sm:text-base mt-4 md:mt-0 mr-2 md:mr-0'
                        size="sm"
                    >
                        create new
                        <Plus className="w-4 h-4 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:w-[40vw] w-[95vw] max-w-[90rem] h-[90vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl">Create New {isInterview ? "Interview" : "Test"}</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            Create a custom {isInterview ? "interview" : "test"} tailored just for you using AI.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className='space-y-2'>
                            <Label htmlFor="jobTitle" className="text-sm sm:text-base">
                                Job Title
                            </Label>
                            <Input
                                id="jobTitle"
                                className="w-full"
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="companyName" className="text-sm sm:text-base">
                                Company Name
                            </Label>
                            <Input
                                id="companyName"
                                className="w-full"
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="jobDescription" className="text-sm sm:text-base">
                                Job Description
                            </Label>
                            <Input
                                accept="application/pdf"
                                id="jobDescription"
                                type="file"
                                ref={jdFileInputRef}
                                onChange={(e) => handleFileUpload(e, setJd, false)}
                                className="w-full"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="resume" className="text-sm sm:text-base">
                                Resume
                            </Label>
                            <Select onValueChange={handleResumeSelection}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a resume" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getUserResumes?.map((resume, index) => (
                                        <SelectItem key={index} value={resume._id}>
                                            {resume.fileName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                accept="application/pdf"
                                id="resume"
                                type="file"
                                ref={resumeFileInputRef}
                                onChange={(e) => handleFileUpload(e, setResume, true)}
                                className="w-full mt-2"
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="difficulty" className="text-sm sm:text-base">
                                Difficulty Level
                            </Label>
                            <Select onValueChange={setDifficulty}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-[#141414] rounded-full text-white p-2 sm:p-3 text-sm sm:text-base w-full sm:w-auto"
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload and Start'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewModal