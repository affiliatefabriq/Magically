"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import { PublicationCard } from "@/components/shared/publication/PublicationCard";
import { UserCard } from "@/components/shared/user/UserCard";
import { SearchEmpty } from "@/components/states/empty/Empty";
import { ExploreError, NotAuthorized, SearchError } from "@/components/states/error/Error";
import { SearchLoader } from "@/components/states/loaders/Loaders";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";

export const Search = () => {
  const t = useTranslations("Search");
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
      {/* Title */}
      <h1 className="title-text my-6">{t("Title")}</h1>
      <div className="flex gap-4">
        <Input
          placeholder="Search users, publications, prompts..."
          className="w-full"
          value={filters.query}
          onChange={(e: any) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
        />
      </div>
      {/* Search Results */}
      <Tabs defaultValue="users">
        <TabsList className="w-full mt-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-2 mt-4">
          {searchResults?.users.length > 0 && (
            <>
              <h2 className="mb-2 subtitle-text">Users</h2>
              {searchResults.users.map((user: any) => (
                <UserCard key={user.id} user={user} />
              ))}
            </>
          )}
        </TabsContent>
        <TabsContent value="publications" className="space-y-4 mt-4">
          {searchResults?.publications.length > 0 && (
            <>
              <h2 className="mb-6 subtitle-text">Publications</h2>
              <div className="grid-2 gap-4">
                {searchResults.publications.map((pub: any) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>
            </>
          )}
          {searchResults && searchResults.users.length === 0 && searchResults.publications.length === 0 && (
            <SearchEmpty />
          )}
        </TabsContent>
      </Tabs>
      {/* States Handler */}
      <div className="flex items-center justify-center w-full h-full">
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
