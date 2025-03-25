import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const ExitButton: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const handleExit = () => {
        router.back();
      };

  return (
    <div className="relative top-4 left-4 z-50">
      <Button
        onClick={handleExit}
        className="flex items-center justify-center gap-2 bg-black hover:bg-[#4c2195] text-white"
      >
        <X className="h-4 w-4" />
        Exit
      </Button>
    </div>
  );
};

export default ExitButton;
