// components/PartyInvites.tsx
type Invite = {
  id: string;
  invitee?: { uuid: string; username: string; profileImg?: string };
  inviter?: { uuid: string; username: string; profileImg?: string };
};

type Props = {
  sentInvites: Invite[];
  receivedInvites: Invite[];
  onRespond: (inviteId: string, accept: boolean) => void;
};

const PartyInvites = ({ sentInvites, receivedInvites, onRespond }: Props) => {
  return (
    <div className="w-full mb-4">
      {/* Received Invites */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Invitations Received</h2>
        {receivedInvites.length === 0 ? (
          <p className="text-sm text-gray-500">No incoming invites.</p>
        ) : (
          receivedInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between border p-3 rounded mb-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    invite.inviter?.profileImg ||
                    "https://thispersondoesnotexist.com/"
                  }
                  className="w-10 h-10 rounded-full"
                  alt="inviter"
                />
                <span>{invite.inviter?.username}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRespond(invite.id, true)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => onRespond(invite.id, false)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sent Invites */}
      <div>
        <h2 className="text-lg font-bold mb-2">Invitations Sent</h2>
        {sentInvites.length === 0 ? (
          <p className="text-sm text-gray-500">No outgoing invites.</p>
        ) : (
          sentInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-start border p-3 rounded mb-2"
            >
              <img
                src={
                  invite.invitee?.profileImg ||
                  "https://thispersondoesnotexist.com/"
                }
                className="w-10 h-10 rounded-full mr-3"
                alt="invitee"
              />
              <span>{invite.invitee?.username}</span>
              <span className="ml-auto text-sm italic text-gray-400">
                Pending...
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PartyInvites;
