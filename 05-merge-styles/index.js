const fs = require('fs'); // подключаю модуль для управления файловой системой
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами
const pathHTML = path.join(__dirname, 'project-dist'); // создание пути папки где HTML
const pathCSS = path.join(__dirname, 'styles'); // создание пути папки где CSS файлы
fs.readdir(pathCSS, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err); // ^^ чтение папки с css файлами
  files = files.filter((x) => {
    const fileExtName = path.extname(x.name).slice(1); //создание расширения файла
    return x.isFile() && fileExtName == 'css';
  });
  files = files.map((x) => {
    return path.join(x.path, x.name);
  });
  files.forEach((x) => {
    const read = fs.createReadStream(x, 'utf-8'); //создание читабельного потока для каждого css файла
    read.on('data', (data) => {
      const doneCSS = fs.createWriteStream(path.join(pathHTML, 'bundle.css'), {
        flags: 'a',
      }); // ^^ Создаем поток записи в режиме добавления
      doneCSS.write(data);
    });
  });
});