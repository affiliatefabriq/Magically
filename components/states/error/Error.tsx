import Link from "next/link";
import {
  CircleUserRound,
  GalleryHorizontalEnd,
  Globe,
  SearchX,
  TriangleAlert,
  UserLock,
  UserRoundX,
  Users,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const NotAuthorized = () => {
  const t = useTranslations("States.Error.NotAuthorized");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserLock />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Link href="/register">
            <Button variant="outline" className="btn-outline">
              <CircleUserRound />
              <span>{t("register")}</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button className="btn-solid">
              <Globe />
              <span>{t("login")}</span>
            </Button>
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
};

export const ErrorComponent = ({
  title,
  description,
  icon: Icon,
  button,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  button?: string;
}) => {
  return (
    <Empty className="max-w-96 bg-red-200/50 border-red-400 dark:bg-red-800/20 dark:border-red-800/50 border shadow-red-800/10 shadow-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-red-300 dark:bg-red-900/50">
          <Icon className="text-red-800 dark:text-red-500" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{button && <Button>{button}</Button>}</EmptyContent>
    </Empty>
  );
};

export const ExploreError = () => {
  const t = useTranslations("States.Error.Explore");

  return <ErrorComponent title={t("title")} description={t("description")} icon={TriangleAlert} />;
};

export const SearchError = () => {
  const t = useTranslations("States.Error.Search");

  return <ErrorComponent title={t("title")} description={t("description")} icon={SearchX} />;
};

export const ProfileError = () => {
  const t = useTranslations("States.Error.Profile");

  return <ErrorComponent title={t("title")} description={t("description")} icon={UserRoundX} />;
};

export const FollowingError = () => {
  const t = useTranslations("States.Error.Following");

  return <ErrorComponent title={t("title")} description={t("description")} icon={Users} />;
};

export const FollowersError = () => {
  const t = useTranslations("States.Error.Followers");

  return <ErrorComponent title={t("title")} description={t("description")} icon={Users} />;
};

export const LibraryError = () => {
  const t = useTranslations("States.Error.Library");

  return <ErrorComponent title={t("title")} description={t("description")} icon={GalleryHorizontalEnd} />;
};

export const HiggsfieldMotionError = () => {
  const t = useTranslations("States.Error.HiggsfieldMotion");

  return <ErrorComponent title={t("title")} description={t("description")} icon={Video} />;
};
