import gulp from 'gulp';
import gulpSass from "gulp-sass";
import nodeSass from 'sass';
import less from 'gulp-less';
import ts from 'gulp-typescript';
import chalk from 'chalk';
import del from 'del';
import path from 'path';
import fs from 'fs-extra';
import stringify from 'json-stringify-pretty-compact';
import git from 'gulp-git';
import yargs from 'yargs';

const sass = gulpSass(nodeSass);

const sassOpts = { outputStyle: 'compressed', errLogToConsole: true };

const tsConfig = ts.createProject('tsconfig.json');

gulp.task('buildTS', () => {
    return gulp.src('src/**/*.ts').pipe(tsConfig()).pipe(gulp.dest('dist'));
});

gulp.task('buildLESS', () => {
    return gulp.src('src/*.less').pipe(less()).pipe(gulp.dest('dist'));
});

gulp.task('buildSASS', () => {
    return gulp.src('src/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('dist'));
});

gulp.task('copyFiles', async (done) => {
    console.log('', chalk.red(stringifyJson(gitTag())));
    const statics = ['lang', 'fonts', 'assets', 'templates', 'module.json', 'system.json', 'template.json'];
    try {
        for (const file of statics) {
            if (fs.existsSync(path.join('src', file))) {
                if (fs.lstatSync(path.join('src', file)).isFile()) {
                    var p = path.join('src', file);
                    console.log('  ', chalk.yellowBright(p));
                    gulp.src(p).pipe(gulp.dest('dist'));
                }
                if (fs.lstatSync(path.join('src', file)).isDirectory()) {
                    var p = path.join('src', file, '/**/*');
                    console.log('  ', chalk.greenBright(p));
                    gulp.src([p], { base: 'src/' }).pipe(gulp.dest(path.join('dist')));
                }
            }
        }
    } catch (error) {

    }
    done();
});

gulp.task('sass', () => {
    gulp.src('./**/*.scss')
        .pipe(sass(sassOpts))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', async (done) => {
    return del('dist/**', { force: true });
});

// Future Task .. Packager and Version Incrementor

function getManifest() {
    const json = {};
    if (fs.existsSync('src')) {
        json.root = 'src';
    } else {
        json.root = 'dist';
    }

    const modulePath = path.join(json.root, 'module.json');

    if (fs.existsSync(modulePath)) {
        json.file = fs.readJSONSync(modulePath);
        json.name = 'module.json';
    }

    return json;
}

function updateManifest(cb) {
    const packageJson = fs.readJSONSync('package.json');
    const manifest = getManifest();
}

function stringifyJson(json) {
    const prettyProjectJson = stringify(json, {
        maxLength: 35,
        indent: '\t',
    });
    return prettyProjectJson;
}

function gitTag() {
    const manifest = getManifest();
    return git.tag(`v${manifest.file.version}`, `Updated to ${manifest.file.version}`, (err) => {
        if (err) throw err;
    });
}

gulp.task('updateManifest', (done) => done());
gulp.task('gitCommit', (done) => done());

gulp.task('default', gulp.series('clean', 'buildTS', 'buildLESS', 'buildSASS', 'copyFiles'));