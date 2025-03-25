import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/cardSS';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from "convex/react";
import { api } from ".././convex/_generated/api";

interface ChatButtonProps {
  username: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({  username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const messages = useQuery(api.messages.getMessages, { sender:username }) || [];
  const sendMessage = useMutation(api.messages.sendMessage);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage({
            sender: username, text: inputMessage,
          timestamp: 0
      });
      setInputMessage('');
    }
  };

  return (
    <div className="fixed bottom-16 right-10 z-50">
      {isOpen ? (
        <Card className="w-80 h-[40rem] flex flex-col">
          <CardHeader className="relative flex justify-center items-center">
            <h3 className="font-semibold">Chat</h3>
            <Button
              className="absolute -right-3 -top-5 rounded-full"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}>
                <span className="bg-blue-100 rounded px-2 py-1 inline-block">
                  <strong>{msg.sender}: </strong>{msg.text}
                </span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="w-full flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button type="submit">Send</Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button onClick={toggleChat} className="rounded-full h-12 w-12 flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ChatButton;
