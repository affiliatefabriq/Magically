import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type PublicationImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export const PublicationImage = ({ src, alt, className }: PublicationImageProps) => {
  const t = useTranslations("Components.Publication");
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 text-muted-foreground aspect-square rounded-xl theme-2">
        <ImageIcon className="size-12" />
        <span>{t("noImage")}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      width={1024}
      height={1024}
      alt={alt}
      className={`rounded-xl object-cover aspect-square w-full ${className}`}
      onError={() => setError(true)}
    />
  );
};
