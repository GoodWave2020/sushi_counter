const { src, dest, parallel, series, watch} = require('gulp');
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const typescript = require('gulp-typescript');
const tslint = require("gulp-tslint");
const prettier = require('gulp-plugin-prettier');
const del = require('del');
// tsconfigの設定を反映
const tsProject = typescript.createProject("tsconfig.json");

const paths = {
    'ts': './ts/',
    'dist': './dist/',
    'tmp': './tmp/'
}

// typesciptをbuildする。
const ts = () => {
    return src([paths.tmp + '*.ts', '!./node_modules/**'])
        .pipe(tsProject())
        .pipe(dest(paths.dist));
};

// tslint
const tsLint = () => {
    return src([paths.tmp + '*.ts', '!./node_modules/**'])
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(tslint({
        formatter: "verbose"
        }))
        .pipe(tslint.report())
};

/**
 * prettierでコードを整形する。
 * 
 * TODO:整形して保存した際にもwatchが働くため無限ループになるので
 * tmpディレクトリに移してビルドしている。他にいいやり方ないかな？
 */
const format = () => {
    return src([paths.ts + '*.ts', '!./node_modules/**'])
        .pipe(prettier.format())
        .pipe(dest(paths.tmp))
};

// tmpフォルダを削除
const clean = (done) => {
    del([paths.tmp + '*.ts'])
    done()
}

// tsディレクトリを監視する。
const tsWatch = () => {
    watch(paths.ts + '**/*.ts', series(format, tsLint, ts, clean));
};

exports.default = series(tsWatch);