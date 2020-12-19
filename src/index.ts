import * as restana from 'restana';
import * as connectQuery from 'connect-query';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as md5 from 'md5';
import config, { isProduction } from './config';
import handleUpload from './upload';
import handleSave from './save';
import handleRemove from './remove';

const service = restana();

service.use(connectQuery());
service.use(bodyParser.json());
service.use(bodyParser.urlencoded({ extended: true }));

/**
 * Загрузка фотографии
 */
const upload = multer({ dest: config.directory.temp });
service.post('/upload', upload.single('file') as any, handleUpload);

/**
 * Сохранение фотографии
 * От бекенда прилетает запрос с параметрами:
 * string s - JSON строка с данными для соханения
 * string g - подпись, md5(секрет + json)
 */
service.get('/save', (req, res) => {
    const query = req.query;
    const json = query.s as string;
    const sig = query.g as string;
    const expect = md5(config.secret.SAVE + json);

    if (isProduction && expect !== sig) {
        res.send('invalid sig');
        return;
    }

    const sizes = JSON.parse(json).sizes;

    handleSave(sizes);

    res.send('ok');
});

/**
 * Удаление фотографии
 * От бекенда прилетает запрос с параметрами:
 * string path - путь к файлу относительно config.path.permanent, \n, название файла
 * string sig  - подпись, md5(секрет + path)
 */
service.get('/remove', (req, res) => {
    const query = req.query as Record<string, string>;
    try {
        res.send(handleRemove(query))
    } catch (e) {
        res.send(`error: ${e.message}`);
    }
});

/**
 * Шаблон для отладки
 */
service.get('/upload', (req, res) => {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.send('<form method="post" enctype="multipart/form-data">'
        + '<p>Image: <input type="file" name="file" /></p>'
        + '<p>Type: <input type="text" name="type" value="1" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

service.start(config.secret.PORT)
    .then(() => process.stdout.write(`Photo server started on port ${config.secret.PORT}\n`));
