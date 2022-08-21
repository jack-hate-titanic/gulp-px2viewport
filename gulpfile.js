/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2022-08-21 13:17:09
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2022-08-21 15:28:00
 * @FilePath: /gulp-px2viewport/dev.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require("path");
const less = require('gulp-less');
const gulp = require("gulp");
const fs = require('fs-extra');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const config = require('./config');


function toFile(p) {
  const ext = path.extname(p);
  const basename = path.basename(p, ext);
  const extMap = {
    '.less': '.css'
  }
  const file = path.join(
    path.relative('../src', path.dirname(p)),
    `${basename}${extMap[ext]?extMap[ext]: ext}`
  )

  return file;
}

function unlink(p) {
  fs.removeSync(toFile(p));
}

function compileLess(p) {
  return gulp.src(path.join(__dirname, p))
    .pipe(less())
    .pipe(replace(/(\d+(:?[.]\d+)?)px/g, function (match, px) {
      
      if (config && (config.landscape === true) && config.windowHeight) {
        return `${(px / config.windowHeight * 100).toFixed(4)}vh`
      }
      if (config && (config.landscape === false) && config.windowWidth) {
        return `${(px / config.windowWidth * 100).toFixed(4)}vw`
      }
    }))
    .pipe(rename({
      extname: '.css',
    }))
    .pipe(gulp.dest(path.join(toFile(p), '..')));
}

function watchLess(done) {
  const watcher = gulp.watch(["./src/**/*.less"], {
    ignoreInitial: false,
  });
  watcher.on('add', compileLess)

  watcher.on('change', compileLess)

  watcher.on('unlink', unlink);

  done();
}

exports.default = gulp.series(watchLess);
