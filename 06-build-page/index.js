const fs = require('fs'); // подключаю модуль для управления файловой системой
const path = require('path'); // подключаю модуль для работы с путями к файлам и каталогами
const pathComponents = path.join(__dirname, 'components'); // создание пути к папке компонентов html
const pathStyles = path.join(__dirname, 'styles'); // создание пути к папке styles, где css файлы
const pathAssets = path.join(__dirname, 'assets'); // создание пути к папке assets
const pathProjectDist = path.join(__dirname, 'project-dist'); // создание пути к итоговой папке
const pathHtmlOriginal = path.join(__dirname, 'template.html') // создание пути к оригиналу HTML файла
const pathAssetsCopy = path.join(pathProjectDist, 'assets'); // создание пути к папке assets копии

function createProjectDist() {
  fs.mkdir(pathProjectDist, { recursive: true }, (err) => {
    if (err) console.log(err);
  });
} // создание итоговой папки

function mergeStyles() {
  fs.truncate(path.join(pathProjectDist, 'style.css'), 0, (err) => {
    if (err) console.error(err);
    fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
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
          const doneCSS = fs.createWriteStream(
            path.join(pathProjectDist, 'style.css'),
            {
              flags: 'a',
            },
          ); // ^^ Создаем поток записи в режиме добавления
          doneCSS.write(data);
        });
      });
    });
  });
}

function generateHTML() {
  const read = fs.createReadStream(pathHtmlOriginal, 'utf-8'); // читаем оригинал html
  read.on('data',(html) => {
      fs.readdir(pathComponents, { withFileTypes: true }, (err, files) => { 
        if (err) console.log(err); // ^^ читаем папку с компонентами
        files.forEach((file) => {
          if (file.isFile() && path.extname(file.name) === '.html') {
            const readFile = fs.createReadStream(
              path.join(file.path, file.name),
              'utf-8', 
            ); // ^^ читаем каждый компонент в папке с компонентами, если он файл и он имеет расширение html

            readFile.on('data', (data) => {
              html = html.replaceAll(`{{${path.parse(file.name).name}}}`, data);
            }); //  ^^ заменяем ссылки в html на текст из компонентов  папки компонентов
            readFile.on('end', () => {
              fs.createWriteStream(
                path.join(pathProjectDist, 'index.html'),
              ).write(html); // записываем все в созданный файл index.html
            });
          }
        });
      });
    },
  );
} // html - оригинал html
  // data - каждый из компонентов


function copyDir(pathName, folderName) {
  fs.mkdir(
    path.join(pathAssetsCopy, folderName), // создание копии папки assets в итоговой папке
    { recursive: true },
    (err) => {
      if (err) console.log(err);
    },
  );
  fs.readdir( // чтение папки assets
    pathName,
    {
      withFileTypes: true,
    },
    (err, files) => {
      if (err) console.log(err);
      files.forEach((file) => {
        if (file.isDirectory() && file.name.length) { 
          copyDir(path.join(file.path, file.name), file.name); // если внутри assets еще папки, вызывается рекурсивная функция для создания копии папки в копии папки assets
        }

        if (file.isFile()) {
          fs.copyFile(
            path.join(file.path, file.name),
            path.join(file.path.replace(__dirname, pathProjectDist), file.name), 
            (err) => { // если внутри папки assets или папках, находящихся в assets только файлы, то они копируются в соответствующие папки-копии 
              if (err) console.log(err);
            },
          );
        }
      });
    },
  );
}
  

function initFunc() {
  createProjectDist();
  mergeStyles();
  generateHTML();
  copyDir(pathAssets, '');
}

initFunc();
