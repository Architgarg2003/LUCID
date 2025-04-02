// "use client";

// import { WebAudioContext } from "@/providers/audio/webAudio";
// import { BottomBar } from "@/components/BottomBar";
// import { RoomInfo } from "@/components/RoomInfo";
// import { UsernameInput } from "@/components/UsernameInput";
// import {
//     ConnectionDetails,
//     ConnectionDetailsBody,
// } from "@/pages/api/connection_details";
// import { LiveKitRoom } from "@livekit/components-react";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import {
//     CharacterName,
//     CharacterSelector,
// } from "@/components/CharacterSelector";
// import { useMobile } from "@/util/useMobile";
// import { GameView } from "@/components/GameView";
// import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { useAuth } from "@clerk/clerk-react";
// import { redirect, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";




// export default function Page() {
//     const [connectionDetails, setConnectionDetails] =
//         useState<ConnectionDetails | null>(null);
//     const [selectedCharacter, setSelectedCharacter] =
//         useState<CharacterName>("doux");
//     const isMobile = useMobile();
//     const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

//     const { userId } = useAuth() as {userId:string};
//     const router = useRouter();
//     if (!userId) {
//         router.push("/");
//     }

//     const getUserLeaderboardData = useQuery(api.LeaderBoard.getUserLeaderboardData, { userId: userId })
//     console.log("getUserLeaderboardData", getUserLeaderboardData);
//     const username = getUserLeaderboardData?.username || "";

//     useEffect(() => {
//         setAudioContext(new AudioContext());
//         return () => {
//             setAudioContext((prev) => {
//                 prev?.close();
//                 return null;
//             });
//         };
//     }, []);
//     const room_name = 'AXIOM STAGE'

//     const humanRoomName = useMemo(() => {
//         return decodeURI(room_name);
//     }, [room_name]);

//     const requestConnectionDetails = useCallback(
//         async (username: string) => {
//             const body: ConnectionDetailsBody = {
//                 room_name,
//                 username,
//                 character: selectedCharacter,
//             };
//             const response = await fetch("/api/connection_details", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(body),
//             });
//             if (response.status === 200) {
//                 return response.json();
//             }

//             const { error } = await response.json();
//             throw error;
//         },
//         [room_name, selectedCharacter]
//     );

//     if (!audioContext) {
//         return null;
//     }

//     const HandleJoin = async () => {
//         try {
//             const connectionDetails = await requestConnectionDetails(username);
//             setConnectionDetails(connectionDetails);
//         } catch (e: any) {
//             toast.error(e.message || "Failed to join the room");
//         }
//     };


//     // If we don't have any connection details yet, show the username form
//     if (connectionDetails === null) {
//         return (
//             <div className="w-screen h-screen flex flex-col items-center justify-center">
//                 <Toaster />
//                 <h2 className="md:text-7xl text-4xl text-[#7c3aed] font-bold mb-3">{humanRoomName}</h2>
//                 <RoomInfo roomName={room_name} />
//                 <div className="divider"></div>
//                 <CharacterSelector
//                     selectedCharacter={selectedCharacter}
//                     onSelectedCharacterChange={setSelectedCharacter}
//                 />
//                 <Button className="h-10 w-80 bg-black text-white mt-3" onClick={HandleJoin}>
//                     Join Now
//                 </Button>
//             </div>
//         );
//     }

//     // Show the room UI
//     return (
//         <div>
//             <LiveKitRoom
//                 token={connectionDetails.token}
//                 serverUrl={connectionDetails.ws_url}
//                 connect={true}
//                 connectOptions={{ autoSubscribe: false }}
//                 options={{ expWebAudioMix: { audioContext } }}
//             >
//                 <WebAudioContext.Provider value={audioContext}>
//                     <div className="flex h-screen w-screen">
//                         <div
//                             className={`flex ${isMobile ? "flex-col-reverse" : "flex-col"
//                                 } w-full h-full`}
//                         >
//                             <div className="grow flex">
//                                 <div className="grow">
//                                     <GameView />
//                                 </div>
//                             </div>
//                             <div className="bg-neutral">
//                                 <BottomBar />
//                             </div>
//                         </div>
//                     </div>
//                 </WebAudioContext.Provider>
//             </LiveKitRoom>
//         </div>
//     );
// }






"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Code, Link, MoreHorizontal, Trash2, Save } from "lucide-react"

// Define the structure of a note
interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default function ForumPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editableContent, setEditableContent] = useState("")
  const [editableTitle, setEditableTitle] = useState("")

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("forum-notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
      setNotes(parsedNotes)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("forum-notes", JSON.stringify(notes))
    }
  }, [notes])

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Create a new note
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setNotes([newNote, ...notes])
    setCurrentNote(newNote)
    setEditableTitle("Untitled Note")
    setEditableContent("")
  }

  // Select a note to edit
  const selectNote = (note: Note) => {
    setCurrentNote(note)
    setEditableTitle(note.title)
    setEditableContent(note.content)
  }

  // Save the current note
  const saveNote = () => {
    if (!currentNote) return
    
    const updatedNotes = notes.map(note => {
      if (note.id === currentNote.id) {
        return {
          ...note,
          title: editableTitle,
          content: editableContent,
          updatedAt: new Date()
        }
      }
      return note
    })
    
    setNotes(updatedNotes)
    setCurrentNote({
      ...currentNote,
      title: editableTitle,
      content: editableContent,
      updatedAt: new Date()
    })
  }

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    if (currentNote && currentNote.id === id) {
      setCurrentNote(null)
      setEditableTitle("")
      setEditableContent("")
    }
  }

  // Apply formatting to selected text
  const applyFormatting = (format: string) => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editableContent.substring(start, end)
    let formattedText = ""
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
      case 'h1':
        formattedText = `# ${selectedText}`
        break
      case 'h2':
        formattedText = `## ${selectedText}`
        break
      case 'h3':
        formattedText = `### ${selectedText}`
        break
      case 'bullet-list':
        formattedText = `\n- ${selectedText}`
        break
      case 'numbered-list':
        formattedText = `\n1. ${selectedText}`
        break
      case 'quote':
        formattedText = `> ${selectedText}`
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        break
      case 'link': 
        formattedText = `[${selectedText}](url)`
        break
      default:
        formattedText = selectedText
    }
    
    const newContent = editableContent.substring(0, start) + formattedText + editableContent.substring(end)
    setEditableContent(newContent)
    
    // Set focus back to the textarea and position cursor after formatted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar - Notes list */}
      <div className="w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <button 
              className="p-1 rounded-full hover:bg-gray-100" 
              onClick={createNewNote}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <input 
            placeholder="Search notes..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="h-[calc(100vh-160px)] overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <div 
                    key={note.id} 
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      currentNote?.id === note.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => selectNote(note)}
                  >
                    <div className="truncate">
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? "No matching notes found" : "No notes yet"}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 h-full">
        {currentNote ? (
          <div className="h-full flex flex-col">
            {/* Editor toolbar */}
            <div className="bg-white border-b border-gray-200 p-2 flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('bold')}>
                <Bold className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('italic')}>
                <Italic className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('underline')}>
                <Underline className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('h1')}>
                <Heading1 className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('h2')}>
                <Heading2 className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('h3')}>
                <Heading3 className="h-4 w-4" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('bullet-list')}>
                <List className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('numbered-list')}>
                <ListOrdered className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('quote')}>
                <Quote className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('code')}>
                <Code className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100" onClick={() => applyFormatting('link')}>
                <Link className="h-4 w-4" />
              </button>

              <div className="ml-auto">
                <button 
                  className="px-3 py-1 rounded border border-gray-300 flex items-center hover:bg-gray-50"
                  onClick={saveNote}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
              </div>
            </div>
            
            {/* Editor content */}
            <div className="flex-1 overflow-auto bg-white p-6">
              <input
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-2xl font-bold w-full border-none focus:outline-none mb-4"
                placeholder="Note title"
              />
              
              <textarea
                id="editor"
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-[calc(100%-60px)] border-none focus:outline-none resize-none"
                placeholder="Start writing here..."
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-96">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Welcome to Forum Notes</h2>
                <p className="text-gray-500 text-sm">Create a new note to get started</p>
              </div>
              <div>
                <p className="text-gray-500 mb-4">
                  This is a simple note-taking application. Create and manage your notes just like in Notion.
                </p>
                <button 
                  onClick={createNewNote} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}