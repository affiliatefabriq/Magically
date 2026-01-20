import Image from "next/image";
import Link from "next/link";
import { BookOpen, GalleryHorizontalEnd, Newspaper, SearchX, UserRoundX, Workflow } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const EmptyComponent = ({
  title,
  description,
  icon: Icon,
  button,
  buttonLink,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  button?: string;
  buttonLink?: string;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {button && (
          <Link href={buttonLink!}>
            <Button className="btn-login">{button}</Button>
          </Link>
        )}
      </EmptyContent>
    </Empty>
  );
};

export const ExploreEmpty = () => {
  const t = useTranslations("States.Empty.Publications");
  return (
    <EmptyComponent
      title={t("title")}
      description={t("description")}
      button={t("button")}
      buttonLink="/create/magic-photo/tt"
      icon={Newspaper}
    />
  );
};

export const SearchUserEmpty = () => {
  const t = useTranslations("States.Empty.SearchUser");
  return <EmptyComponent title={t("title")} description={t("description")} icon={UserRoundX} />;
};

export const SearchPublicationEmpty = () => {
  const t = useTranslations("States.Empty.SearchPublication");
  return <EmptyComponent title={t("title")} description={t("description")} icon={SearchX} />;
};

export const PersonalProfileEmpty = () => {
  const t = useTranslations("States.Empty.PersonalProfile");
  return (
    <EmptyComponent
      title={t("title")}
      description={t("description")}
      button={t("button")}
      buttonLink="/create/magic-photo/tt"
      icon={BookOpen}
    />
  );
};

export const UserProfileEmpty = () => {
  const t = useTranslations("States.Empty.UserProfile");
  return <EmptyComponent title={t("title")} description={t("description")} icon={BookOpen} />;
};

export const LibraryEmpty = () => {
  const t = useTranslations("States.Empty.Library");
  return (
    <EmptyComponent
      title={t("title")}
      description={t("description")}
      button={t("button")}
      buttonLink="/create/magic-photo/tt"
      icon={GalleryHorizontalEnd}
    />
  );
};

export const JobEmpty = () => {
  const t = useTranslations("States.Empty.Job");
  return (
    <EmptyComponent
      title={t("title")}
      description={t("description")}
      button={t("button")}
      buttonLink="/"
      icon={Workflow}
    />
  );
};

export const NotFoundPage = () => {
  const t = useTranslations("States.Empty.NotFound");

  return (
    <EmptyComponent
      title={t("title")}
      description={t("description")}
      button={t("button")}
      buttonLink="/"
      icon={SearchX}
    />
  );
};

export const ModelsEmpty = () => {
  const t = useTranslations("States.Empty.Models");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Image src="/model.jpg" alt="model" width={1024} height={1024} className="rounded-xl" />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/create/models">
          <Button className="btn-login">{t("button")}</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
};

export const TtModelsEmpty = () => {
  const t = useTranslations("States.Empty.Models");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Image src="/model.jpg" alt="model" width={1024} height={1024} className="rounded-xl" />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/create/models/ttapi">
          <Button className="btn-login">{t("button")}</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
};
