// // import React from 'react';
// // import CrocoAvatarPng from './croco.png';

// // export const CrocoAvatarIcon: React.FC = () => (
// //     // Placeholder for Croco's logo icon.
// //     <div className="w-full h-full rounded-full bg-accent" />
// // );

// import React from 'react';
// import CrocoAvatarPng from './croco.png';

// export const CrocoAvatarIcon: React.FC = () => (
//     // The placeholder div is replaced with an img tag.
//     // The src attribute is set to the imported image.
//     <div className="w-full h-full rounded-full bg-accent">
//         <img
//             src={CrocoAvatarPng}
//             alt="Croco Avatar Icon"
//             className="w-full h-full object-cover"
//         />
//     </div>
// );
// export const UserAvatarIcon: React.FC = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-light/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//         <circle cx="12" cy="7" r="4" />
//     </svg>
// );

// export const SendIcon: React.FC = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <line x1="22" y1="2" x2="11" y2="13" />
//         <polygon points="22 2 15 22 11 13 2 9 22 2" />
//     </svg>
// );

// export const ImageFileIcon: React.FC = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
//     </svg>
// );




import React from 'react';

interface CrocoAvatarIconProps {
  isLarge?: boolean;
}

export const CrocoAvatarIcon: React.FC<CrocoAvatarIconProps> = ({ isLarge = false }) => (
    <div className={`w-full h-full rounded-full bg-secondary/90 flex items-center justify-center ${isLarge ? 'border-2 border-dotted border-accent/30' : 'border border-accent/20'}`}>
        <img src="/croco.png" alt="Croco Avatar" className="w-3/4 h-3/4 object-contain" />
    </div>
);


export const UserAvatarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-light/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

export const ImageFileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
);