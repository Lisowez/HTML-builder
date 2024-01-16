const fs = require('fs'); // подключаю модуль для управления файловой системой
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами
const pathClone = path.join(__dirname, 'files-copy'); // создание пути папки-клона
const pathTrue = path.join(__dirname, 'files'); // создание пути папки-оригинала
fs.rm(pathClone, { recursive: true, force: true }, (err) => {
  if (err) console.log(err); // удаление содержимого папки-клона
  fs.mkdir(pathClone, { recursive: true }, (err) => {
    if (err) console.log(err); // ^ создание папки-клона
    fs.readdir(pathTrue, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err); // ^ чтение папки-оригинала и создание массива объектов, находящихся в ней
      files.forEach((x) => {
        const pathFile = path.join(x.path, x.name); //создание пути каждого из объектов в папке-оригинале
        fs.copyFile(pathFile, path.join(pathClone, x.name), (err) => {
          if (err) console.log(err); // ^ клонирование каждого объекта из папки-оригинала в папку-клон
        });
      });
    });
  });
});
