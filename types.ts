// export enum Role {
//   USER = 'user',
//   MODEL = 'model',
// }

// export interface Message {
//   role: Role;
//   text: string;
//   image?: string; // data URL for the image
// }


export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
  image?: string; // data URL for the image
}

export type UserProfile = Record<string, any>;
