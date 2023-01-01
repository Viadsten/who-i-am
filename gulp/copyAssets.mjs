import gulp from 'gulp';

const copySvg = () => gulp.src('source/img/**/*.svg', {base: 'source'}).pipe(gulp.dest('docs'));

const copyImages = () => gulp.src('source/img/**/*.{png,jpg,jpeg,webp}', {base: 'source'}).pipe(gulp.dest('docs'));

const copy = () =>
  gulp
      .src(['source/**.html', 'source/fonts/**', 'source/img/**', 'source/favicon/**', 'source/data/**'], {
        base: 'source',
      })
      .pipe(gulp.dest('docs'));

export {copy, copyImages, copySvg};
