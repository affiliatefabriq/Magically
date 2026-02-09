declare type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

// bePaid Widget Types
declare global {
  interface Window {
    BeGateway?: new (params: BeGatewayParams) => BeGatewayInstance;
  }
}

interface BeGatewayParams {
  checkout_url: string;
  fromWebview?: boolean;
  checkout: {
    iframe: boolean;
    test?: boolean;
    transaction_type: 'payment';
  };
  token: string;
  closeWidget: (status: BeGatewayStatus | null) => void;
}

interface BeGatewayInstance {
  createWidget: () => void;
}

type BeGatewayStatus =
  | 'successful'
  | 'failed'
  | 'pending'
  | 'redirected'
  | 'error';

export interface Author {
  id: string;
  username: string;
  fullname: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  publicationId: string;
  parentId?: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies?: Comment[];
  isLiked?: boolean;
}

export interface Publication {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  likeCount: number;
  commentCount: number;
  isPhotoOfTheDay: boolean;
  createdAt: string;
  updatedAt: string;
  author: Author;
  isLiked?: boolean;
  isFollowing?: boolean;
}

export type ReplicateStatus =
  | 'starting'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface UserAttributes {
  id: string;
  fullname: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  interests?: string[];
  tokens: number;
  dailyActions: {
    count: number;
    lastReset: Date;
  };
  role: 'user' | 'admin';
  isBlocked: boolean;
  verified: boolean;
  publicationsCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  publications: Publication[];
  replicateModels?: {
    id: string;
    version: string;
    name: string;
    status: ReplicateStatus;
  }[];
}

export interface GalleryItem {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string; // Can be a video path as well
  generationType: string;
  createdAt: string;
}

// Generation-specific types
export interface GptGenerationStatus {
  task_id: string;
  status: 'completed' | 'processing' | 'failed';
  prompt: string;
  output: {
    image_url?: string;
  };
  error: any;
}
