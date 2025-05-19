import { useMutation } from "@apollo/client";
import {
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
} from "@/graphql/friends/friendMutations";
import { User } from "@/contexts/AuthContext";

type FriendRequest = {
  sender: User;
  receiver: User;
  status: string;
  requestedAt: string;
};

type FriendRequestsProps = {
  received: FriendRequest[];
  sent: FriendRequest[];
};

const FriendRequests = ({ received, sent }: FriendRequestsProps) => {
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST);

  return (
    <div className="space-y-8 mt-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Received Requests
        </h2>
        <ul className="space-y-4">
          {received.map((req, index) => (
            <li
              key={index}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 dark:text-white font-semibold">
                  From: {req.sender.username}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requested At: {new Date(req.requestedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() =>
                    acceptRequest({ variables: { senderId: req.sender.uuid } })
                  }
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() =>
                    rejectRequest({ variables: { senderId: req.sender.uuid } })
                  }
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Sent Requests
        </h2>
        <ul className="space-y-4">
          {sent.map((req, index) => (
            <li
              key={index}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <p className="text-gray-800 dark:text-white font-semibold">
                To: {req.receiver.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: {req.status}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Requested At: {new Date(req.requestedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequests;
