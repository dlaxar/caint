var gulp = require('gulp');
var uglify = require('gulp-uglify');

var paths = {
	scripts: ['js/**/*.js', '!js/**/tests/**/*.js']
};

gulp.task('minify', function() {
	
	gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));

});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['minify']);
});

gulp.task('default', ['minify', 'watch']);

