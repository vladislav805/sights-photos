import md5 from 'md5';
import config, { isProduction } from './config';
import path from 'path';
import fs from 'fs';

export default function removeFile(params: Record<string, string>) {
    const { path: p, sig } = params;

    if (!p || !sig || !p.trim().length || !sig.trim().length) {
        throw new Error('params missed');
    }

    if (!p.includes('\n')) {
        throw new Error('param invalid');
    }

    if (isProduction && md5(config.secret.REMOVE + p) !== sig) {
        throw new Error('sig not equals');
    }

    const [localPath, name] = p.split('\n', 2);

    const fullPath = path.resolve(config.directory.permanent, localPath, name);

    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, () => {});
    }

    return 'ok';
}
