import { ChatAltIcon } from "@heroicons/react/solid";

export const TicketUserPhoto = ({ imageUrl }) => {
  return (
    <div className="relative">
      <img
        loading="lazy"
        className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
        src={imageUrl}
        alt=""
      />
      <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
        <ChatAltIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </span>
    </div>
  );
};
