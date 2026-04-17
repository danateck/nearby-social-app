export type AppUser = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  visibilityEnabled: boolean;
  lastActiveAt?: number;
  createdAt?: number;
};

export type Presence = {
  userId: string;
  latitude: number;
  longitude: number;
  visibilityEnabled: boolean;
  updatedAt: number;
};

export type FriendRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
};

export type NearbyEncounter = {
  id: string;
  otherUserId: string;
  displayName: string;
  distanceMeters: number;
  firstSeenAt: number;
  lastSeenAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'none';
};

export type Story = {
  id: string;
  ownerId: string;
  ownerName: string;
  caption: string;
  imageUrl: string;
  createdAt: number;
  expiresAt: number;
};

export type Chat = {
  id: string;
  title: string;
  isGroup: boolean;
  updatedAt: number;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
};
