import { useEffect, useState } from 'react';
import Card from '../components/Card';
import RequestList from '../components/RequestList';
import { useAuth } from '../context/AuthContext';
import { approveFriendRequest, rejectFriendRequest, subscribeToIncomingRequests } from '../services/friendService';
import { FriendRequest } from '../types';

export default function FriendsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    return subscribeToIncomingRequests(user.uid, setRequests);
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card title="Friend requests" subtitle="Approve or reject nearby people">
        <RequestList
          items={requests}
          onApprove={(requestId, fromUserId) => approveFriendRequest(user.uid, requestId, fromUserId)}
          onReject={(requestId) => rejectFriendRequest(user.uid, requestId)}
        />
      </Card>
    </div>
  );
}
