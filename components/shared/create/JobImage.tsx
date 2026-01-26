import Image from "next/image";
import { AlertTriangle, Sparkles } from "lucide-react";
import { PublicationImage } from "../publication/PublicationImage";

type Props = {
    status: "pending" | "processing" | "completed" | "failed";
    imageUrl?: string | null;
    alt?: string;
    error?: string;
};

export function JobImage({ status, imageUrl, alt, error }: Props) {
    if (status === "completed" && imageUrl) {
        return (
            <PublicationImage
                src={imageUrl}
                alt={alt || "result"}
                className="rounded-xl object-cover"
            />
        );
    }

    if (status === "failed") {
        return (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-linear-to-br from-red-950 to-black flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_70%)]" />
                <div className="z-10 flex flex-col items-center gap-3 text-red-400">
                    <AlertTriangle size={40} />
                    <span className="text-center text-sm opacity-80">{error}</span>
                </div>
            </div>
        );
    }

    // pending / processing
    return (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden">
            {/* gradient base */}
            <div className="absolute inset-0 bg-linear-to-br from-lime-800 via-green-700 to-teal-800 animate-gradient" />

            {/* shimmer */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

            {/* center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-white animate-pulse text-xl" size={40} />
            </div>
        </div>
    );
};