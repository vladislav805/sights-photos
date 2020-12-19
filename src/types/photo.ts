import { IUploadPhotoIdentity } from '../utils/create-photo-identity';

export interface IPhoto {
    ownerId: number;
    photoId: number;
    type: PhotoType;
    date: number;
    photo200: string;
    photoMax: string;
    latitude?: number;
    longitude?: number;
}

export interface IPhotoRaw extends IPhoto {
    path?: string;
}

export const enum PhotoType {
    SIGHT = 1,
    PROFILE = 2,
    SIGHT_SUGGEST = 4,
}

export interface IUploadPayload {
    sizes: Record<string, IUploadPhotoIdentity>;
    type: number;
    path: string;
    width: number;
    height: number;
    latitude?: number;
    longitude?: number;
    ownerId?: number;
    date?: number;
}
