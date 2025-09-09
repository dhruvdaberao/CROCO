// import React from 'react';
// import { Message, Role } from '../types';
// import { CrocoAvatarIcon, UserAvatarIcon } from './Icons';

// interface ChatMessageProps {
//   message: Message;
//   userAvatar: string | null;
// }

// const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar }) => {
//   const isModel = message.role === Role.MODEL;

//   const containerClasses = isModel
//     ? 'flex items-end space-x-3'
//     : 'flex items-end flex-row-reverse space-x-3 space-x-reverse';
  
//   const bubbleClasses = isModel
//     ? 'bg-model-bg text-text-dark rounded-r-2xl rounded-bl-2xl border border-gray-200/80'
//     : 'bg-user-bg text-white font-medium rounded-l-2xl rounded-br-2xl';

//   return (
//     <div className={`animate-fade-in ${containerClasses}`}>
//       <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
//         {isModel ? <CrocoAvatarIcon /> : (
//             userAvatar ? 
//             <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" /> :
//             <div className="w-full h-full rounded-full bg-accent/80 flex items-center justify-center">
//                  <UserAvatarIcon />
//             </div>
//         )}
//       </div>
//       <div className={`p-1 max-w-md md:max-w-lg lg:max-w-2xl shadow-md ${bubbleClasses}`}>
//         {message.image && (
//             <img src={message.image} alt="User upload" className="rounded-xl mb-2 max-w-xs" />
//         )}
//         {message.text && (
//             <p className="whitespace-pre-wrap px-3 pb-3 pt-2">{message.text}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;




import React from 'react';
import { Message, Role } from '../types';
import { CrocoAvatarIcon, UserAvatarIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  userAvatar: string | null;
  onAvatarClick: () => void;
}

const renderFormattedText = (text: string) => {
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return { __html: formattedText };
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userAvatar, onAvatarClick }) => {
  const isModel = message.role === Role.MODEL;

  const containerClasses = isModel
    ? 'flex items-end space-x-3'
    : 'flex items-end flex-row-reverse space-x-3 space-x-reverse';
  
  const bubbleClasses = isModel
    ? 'bg-model-bg text-text-dark rounded-r-2xl rounded-bl-2xl border border-gray-200/80'
    : 'bg-user-bg text-white font-medium rounded-l-2xl rounded-br-2xl';

  const avatarComponent = (
    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
      {isModel ? <CrocoAvatarIcon /> : (
          userAvatar ? 
          <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" /> :
          <div className="w-full h-full rounded-full bg-accent/80 flex items-center justify-center">
               <UserAvatarIcon />
          </div>
      )}
    </div>
  );

  return (
    <div className={`animate-fade-in ${containerClasses}`}>
      {isModel ? (
        avatarComponent
      ) : (
        <button 
          onClick={onAvatarClick} 
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent rounded-full transition-opacity hover:opacity-80"
          aria-label="Change profile picture"
        >
          {avatarComponent}
        </button>
      )}
      <div className={`p-1 max-w-md md:max-w-lg lg:max-w-2xl shadow-md ${bubbleClasses}`}>
        {message.image && (
            <img src={message.image} alt="User upload" className="rounded-xl mb-2 max-w-xs" />
        )}
        {message.text && (
            <p 
              className="whitespace-pre-wrap px-3 pb-3 pt-2"
              dangerouslySetInnerHTML={renderFormattedText(message.text)}
            />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;