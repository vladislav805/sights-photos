import { IPhoto, IPhotoRaw } from '../types/photo';
import { joinPhotoPath } from './join-path';
import config from '../config';

const raw2object = (raw: IPhotoRaw): IPhoto => {
    const path = raw.path!;
    delete raw.path;
    return {
        ...raw,
        photo200: joinPhotoPath(config.domain.media, path, raw.photo200),
        photoMax: joinPhotoPath(config.domain.media, path, raw.photoMax),
    };
};

export default raw2object;
