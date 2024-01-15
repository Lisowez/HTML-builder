const fs = require('fs'); // подключаю модуль для управления файловой системой
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами
const textPath = path.join(__dirname, 'text.txt'); // нахожу путь к файлу text.txt
const read = fs.ReadStream(textPath, 'utf-8'); //создание читабельного потока
read.on('data', (data) => {
  console.log(data); //чтение text.txt
});
