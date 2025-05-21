"use client";

// components/PartyInvites.tsx
type Invite = {
  id: string;
  invitee?: { uuid: string; username: string; profileImg?: string };
  inviter?: { uuid: string; username: string; profileImg?: string };
};

type PartyInvitesProps = {
  sentInvites: Invite[];
  receivedInvites: Invite[];
  onRespond: (inviteId: string, accept: boolean) => void;
};

const PartyInvites = ({
  sentInvites,
  receivedInvites,
  onRespond,
}: PartyInvitesProps) => {
  return (
    <div className="space-y-4">
      {/* Received Invites */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <span className="bg-teal-600 w-2 h-2 rounded-full mr-2"></span>
          Invitations Received
        </h3>
        {receivedInvites.length === 0 ? (
          <div className="bg-gray-200 dark:bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No incoming invites.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {receivedInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={invite.inviter?.profileImg || "/default-avatar.png"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-teal-500"
                      alt="inviter"
                    />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                  </div>
                  <span className="font-medium text-sm text-gray-800 dark:text-white">
                    {invite.inviter?.username}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRespond(invite.id, true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRespond(invite.id, false)}
                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Invites */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <span className="bg-amber-500 w-2 h-2 rounded-full mr-2"></span>
          Invitations Sent
        </h3>
        {sentInvites.length === 0 ? (
          <div className="bg-gray-200 dark:bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              No outgoing invites.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sentInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={invite.invitee?.profileImg || "/default-avatar.png"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-400 dark:border-gray-600"
                      alt="invitee"
                    />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                  </div>
                  <span className="font-medium text-sm text-gray-800 dark:text-white">
                    {invite.invitee?.username}
                  </span>
                </div>
                <span className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-200">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyInvites;
