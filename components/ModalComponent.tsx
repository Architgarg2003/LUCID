// ModalComponent.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-50" />
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                    <ModalBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.
                            Pellentesque sit amet hendrerit risus, sed porttitor quam.
                        </p>
                        <p>
                            Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor
                            eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor
                            eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et.
                            Culpa deserunt nostrud ad veniam.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onClick={onClose}>
                            Close
                        </Button>
                        <Button color="primary" onClick={onClose}>
                            Action
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalComponent;