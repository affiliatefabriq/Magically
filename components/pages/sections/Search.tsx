"use client";

import { use, useState } from "react";
import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useSearch } from "@/hooks/useSearch";
import { useDebounceValue } from "usehooks-ts";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/shared/user/UserCard";
import { SearchLoader } from "@/components/states/loaders/Loaders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicationCardSimplified } from "@/components/shared/publication/PublicationCard";
import { SearchPublicationEmpty, SearchUserEmpty } from "@/components/states/empty/Empty";
import { ExploreError, NotAuthorized, SearchError } from "@/components/states/error/Error";
import { Separator } from "@/components/ui/separator";

export const Search = () => {
  const t = useTranslations("Pages.Search");
  const [filters, setFilters] = useState({ query: "", type: "all", sortBy: "newest" });
  const [debouncedQuery] = useDebounceValue(filters.query, 500);

  const { data: user, isError } = useUser();
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearch({ ...filters, query: debouncedQuery });

  return (
    <section className="flex flex-col container mx-auto section-padding">
      <h1 className="title-text my-6">{t("title")}</h1>
      <div className="relative flex gap-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          className="component-dark pl-10 h-10 w-full"
          value={filters.query}
          onChange={(e: any) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
        />
      </div>
      <Tabs defaultValue="users">
        <TabsList className="w-full mt-2">
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="publications">{t("publications")}</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-2 mt-4">
          {searchResults?.users.length > 0 && (
            <>
              {searchResults.users.map((user: any) => (
                <UserCard key={user.id} user={user} />
              ))}
            </>
          )}
          {searchResults && searchResults.users.length === 0 && (
            <SearchUserEmpty />
          )}
        </TabsContent>
        <TabsContent value="publications" className="space-y-4 mt-4">
          {searchResults?.publications.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-0 grid-flow-dense auto-rows-auto">
                {searchResults.publications.map((pub: any, id: any) => (
                  <PublicationCardSimplified key={pub.id} publication={pub} id={id} />
                ))}
              </div>
            </>
          )}
          {searchResults && searchResults.publications.length === 0 && (
            <SearchPublicationEmpty />
          )}
        </TabsContent>
      </Tabs>
      {/* States Handler */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        {!user && (
          <div className="state-center">
            <NotAuthorized />
          </div>
        )}
        {user && isError && (
          <div className="state-center">
            <ExploreError />
          </div>
        )}
        {isSearchLoading && (
          <div className="flex flex-col items-center w-full h-full gap-2">
            <SearchLoader />
          </div>
        )}
        {isSearchError && <SearchError />}
      </div>
    </section>
  );
};
