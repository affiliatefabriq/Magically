"use client";

import { useMyProfile } from "@/hooks/useProfile";
import { useGenerateImage } from "@/hooks/useReplicate";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModelsEmpty } from "@/components/states/empty/Empty";

export const MagicPhoto = () => {
    const { data: user } = useMyProfile();
    const generateImage = useGenerateImage();
    const [modelVersion, setModelVersion] = useState("");
    const [prompt, setPrompt] = useState("");

    if (!user) return <ModelsEmpty />;

    const handleGenerate = async () => {
        await generateImage.mutateAsync({ modelVersion, prompt });
    };

    return (
        <section className="flex flex-col container mx-auto max-w-6xl rounded-t-2xl px-2 mt-4">
            <h1 className="title-text">Magic Photo</h1>

            {user.replicateModels.length === 0 ? (
                <ModelsEmpty />
            ) : (
                <div className="mt-6 space-y-4 max-w-xl mx-auto">
                    <Select onValueChange={setModelVersion}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your model" />
                        </SelectTrigger>
                        <SelectContent>
                            {user.replicateModels.map((model: any) => (
                                <SelectItem key={model.id} value={model.version}>
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Describe what to generate..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={!modelVersion || !prompt || generateImage.isPending}
                    >
                        {generateImage.isPending ? "Generating..." : "Generate Image"}
                    </Button>
                </div>
            )}
        </section>
    );
};
