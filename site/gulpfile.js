var config = {
    bowerDir: './bower_components', assetsDir: './assets'
};

var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    mobilizer = require('gulp-mobilizer'),
    seq = require('run-sequence'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat');

gulp.on('error', function(e) {
    throw(e);
});

gulp.task('icons', function(){ 
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
                 .pipe(gulp.dest('./www/fonts'));
});

gulp.task('js', function (){ 
    return gulp.src([
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
            config.bowerDir + '/parsleyjs/dist/parsley.min.js',
            config.bowerDir + '/html5shiv/dist/html5shiv.min.js',
            config.bowerDir + '/respond/dest/respond.min.js',
            config.bowerDir + '/wow/dist/wow.min.js',
            config.bowerDir + '/shufflejs/dist/jquery.shuffle.modernizr.min.js',
            config.bowerDir + '/owlcarousel/owl-carousel/owl.carousel.min.js',
            config.assetsDir + '/js/options.js',
            config.assetsDir + '/js/scripts.js'
        ]
    ).pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/js'))
});

gulp.task('css', function () { 
    return gulp.src([
        config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css',
        config.bowerDir + '/owlcarousel/owl-carousel/owl.carousel.css',
        config.assetsDir + '/css/styles.css',
        config.assetsDir + '/css/options.css',
        config.bowerDir + '/animate.css/animate.min.css',
        config.bowerDir + '/source-sans-pro/index',
        config.bowerDir + '/font-awesome/css/font-awesome.min.css'
    ])
        .pipe(concat('app.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./www/css'))
});

gulp.task('images', function () {
    var stream = gulp.src(config.assetsDir + '/img/**/*');

    stream = stream.pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }));

    return stream.pipe(gulp.dest('./www/img'));
});

//gulp.task('fonts', function () {
//    gulp.src([config.bowerDir + '/font-awesome/fonts/**.*'])
//        .pipe(gulp.dest('./www/fonts'));
//});

gulp.task('html', function () {
    gulp.src(['./*.html'])
        .pipe(gulp.dest('./www'));
});

gulp.task('clean', function (cb) {
    return gulp.src([
        './www/*.html',
        './www/img',
        './www/css',
        './www/js',
        './www/fonts'
    ], {read: false})
        .pipe(rimraf());
});

gulp.task('default', function (done) {
    var tasks = ['html', 'icons', 'images', 'css', 'js'];
    seq('clean', tasks, done);
});