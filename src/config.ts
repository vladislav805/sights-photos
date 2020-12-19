import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * +-+ root
 *   +-- @sights/backend
 *   +-+ @sights/uploader  <- working dir, we here
 *   | +-- dist            <- build
 *   |
 *   +-- storage           <- permanent storage
 *   +-- _tmp              <- uploading temporary storage
 *   +-- _loaded           <- loaded temporary storage
 */
const directory = {
    /**
     * Для временной загрузки multer'а, аналог /tmp
     */
    temp: path.resolve('..', '_tmp'),

    /**
     * Для загруженных, но не сохранённых с помощью photos.save фотографий
     * Периодически эту директорию необходимо чистить
     */
    loaded: path.resolve('..', '_loaded'),

    /**
     * Постоянное хранилище, находится вне проекта
     */
    permanent: path.resolve('..', 'storage'),
};

dotenv.config({
    path: path.resolve('..', '.env'),
});

function getConfigValue<T = string>(key: string): T {
    return (process.env[key] ?? '') as unknown as T;
}

const secret = {
    UPLOAD: getConfigValue('SECRET_UPLOAD'),
    SAVE: getConfigValue('SECRET_SAVE'),
    REMOVE: getConfigValue('SECRET_REMOVE'),
    PORT: +getConfigValue('PORT_MEDIA'),
};

export const isDebug = !!getConfigValue('DEBUG');
export const isProduction = !isDebug;

export type IUploadPhotoSizeKey = 's' | 'b'; // small, big
export type IPhotoField = 'photo200' | 'photoMax';
export type IUploadPhotoVariant = {
    size: number;
    name: IUploadPhotoSizeKey;
    quality: number;
    key: IPhotoField;
    needWatermark?: boolean;
    max?: boolean;
};

export type IUploadPhotoWatermark = {
    font: IUploadPhotoWatermarkFont;
    block: IUploadPhotoWatermarkBlock;
    position: IUploadPhotoWatermarkPosition;
    color: number;
    content: string;
};

type IUploadPhotoWatermarkFont = {
    file: string;
    size: number;
};

type IUploadPhotoWatermarkBlock = {
    height: 0.03
};

type IUploadPhotoWatermarkPosition = {
    x: number;
    y: number;
};



const server = {
    port: 1060,
};

const domain = {
    main: getConfigValue<string>('DOMAIN_MAIN'),
    media: getConfigValue<string>('DOMAIN_MEDIA'),
};

const variants: IUploadPhotoVariant[] = [
    {
        size: 1400,
        name: 'b',
        quality: 95,
        key: 'photoMax',
        max: true,
        needWatermark: true,
    },
    {
        size: 200,
        name: 's',
        quality: 50,
        key: 'photo200',
    }
];

const watermark: IUploadPhotoWatermark = {
    font: {
        file: path.resolve('assets', 'DroidSans.ttf'),
        size: 0.50,
    },
    block: {
        height: 0.03,
    },
    position: {
        x: 0.01,
        y: 0.01,
    },
    color: 0xffffff,
    content: 'sights.velu.ga',
};

export default {
    server,
    domain,
    directory,
    variants,
    watermark,
    secret,
};
