const fs = require('fs'); // подключаю модуль для управления файловой системой
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами
const pathSecret = path.join(__dirname, 'secret-folder'); // создание
fs.readdir(pathSecret, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err); // вывод ошибки в консоль при ошибке
  files = files.filter((x) => {
    return x.isFile();
  });
  files.forEach((x) => {
    const fileName = path.basename(x.name, path.extname(x.name)); //создание имени файла
    const fileExtName = path.extname(x.name).slice(1); //создание расширения файла
    const pathFile = path.join(pathSecret, x.name);
    fs.stat(pathFile, (err, item) => {
      if (err) console.log(err);
      const fileSize = (item.size / 1000).toFixed(2) + 'kb'; //получение размера файла в kb
      console.log(fileName + '-' + fileExtName + '-' + fileSize); // вывод имени файла-расширени файла-размера файла в kb
    });
  });
});
