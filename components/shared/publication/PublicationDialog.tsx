"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Publication } from "@/types";
import { PublicationImage } from "./PublicationImage";
import { UserAvatar } from "../user/UserAvatar";
import { CommentSection } from "./CommentSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_URL } from "@/lib/api";
import { X, Maximize2 } from "lucide-react";
import { useState } from "react";

// Wrapper for image that opens modal on click
export const PublicationDialog = ({ publication, children }: { publication: Publication, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer">
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-full h-full max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-background">
                <div className="relative flex-1 bg-black flex items-center justify-center">
                    <div className={`relative w-full h-full ${isFullScreen ? 'fixed inset-0 z-100 bg-black' : ''}`}>
                        {isFullScreen && (
                            <button onClick={() => setIsFullScreen(false)} className="absolute top-4 right-4 z-50 text-white bg-black/50 p-2 rounded-full">
                                <X />
                            </button>
                        )}

                        <PublicationImage
                            src={publication.imageUrl!}
                            className={`w-full h-full ${isFullScreen ? 'object-contain' : 'object-contain'}`}
                            alt="Full view"
                        />

                        {!isFullScreen && (
                            <button onClick={() => setIsFullScreen(true)} className="absolute bottom-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition">
                                <Maximize2 size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-100 flex flex-col h-full border-l">
                    <div className="p-4 border-b flex items-center gap-3">
                        <UserAvatar {...publication.author} size="sm" />
                        <span className="font-semibold text-sm">{publication.author.username}</span>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <p className="text-sm mb-4">{publication.content}</p>
                        <CommentSection publicationId={publication.id} />
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};