const fs = require('fs'); // подключаю модуль для управления файловой системой
const { stdin, stdout } = process; //создание входного и выходного параметра
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами

stdout.write('Hello! Write your text.'); //создание приветствия

const output = fs.WriteStream(path.join(__dirname, '02-write-file.txt')); //создание файла для вывода записанного

stdin.on('data', (data) => {
  const dataWord = data.toString().trim();
  if (dataWord === 'exit') {
    process.exit(); //проверка на слово exit для выхода
  } else {
    output.write(dataWord); //запись вводимого слова в созданный файл
    output.write('\n'); //переход на новую строку
  }
});
process.on('SIGINT', () => {
  process.exit();
}); //окончание при нажатии ctrl+c

process.on('exit', () => {
  stdout.write('File newFile.txt is ready for check. Goodbye!');
}); //создание прощальной фразы при окончании
