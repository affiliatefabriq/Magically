export const queryKeys = {
  // auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // user
  users: {
    all: ['users'] as const,
    profile: (username: string) =>
      [...queryKeys.users.all, 'profile', username] as const,
    followers: (username: string) =>
      [...queryKeys.users.all, 'followers', username] as const,
    following: (username: string) =>
      [...queryKeys.users.all, 'following', username] as const,
  },

  // Search
  search: {
    all: ['search'] as const,
    query: (filters: any) =>
      [...queryKeys.search.all, 'query', filters] as const,
  },

  // Publications
  publications: {
    all: ['publications'] as const,
    list: (filters: any) =>
      [...queryKeys.publications.all, 'list', filters] as const,
    detail: (id: string) =>
      [...queryKeys.publications.all, 'detail', id] as const,
    liked: () => [...queryKeys.publications.all, 'liked'] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    list: (publicationId: string) =>
      [...queryKeys.comments.all, 'list', publicationId] as const,
  },

  // Gallery
  gallery: {
    all: ['gallery'] as const,
    list: (filters: any) =>
      [...queryKeys.gallery.all, 'list', filters] as const,
    publish: (galleryItemId: string) =>
      [...queryKeys.gallery.all, 'publish', galleryItemId] as const,
  },

  // Recommendations
  recommendations: {
    all: ['recommendations'] as const,
    users: (limit: number) =>
      [...queryKeys.recommendations.all, 'users', limit] as const,
  },

  history: {
    all: ['history'] as const,
    list: (page: number, limit: number) =>
      [...queryKeys.history.all, 'list', page, limit] as const,
    detail: (id: string) => [...queryKeys.history.all, 'detail', id] as const,
  },

  // Higgsfield
  higgsfield: {
    all: ['higgsfield'] as const,
    motions: () => [...queryKeys.higgsfield.all, 'motions'] as const,
  },
} as const satisfies Record<string, any>;
