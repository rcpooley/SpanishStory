const gulp = require('gulp');
const gulpTypescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const tsProject = gulpTypescript.createProject('tsconfig.json');

gulp.task('compile', () => {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(gulpTypescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], () => {
    gulp.watch('src/**/*.ts', ['compile']);
});

gulp.task('assets', () => {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);