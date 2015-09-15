/**
 * Minify PNG, JPEG, GIF and SVG images
 *
 * @author  willhu
 * @date    2015-09-01
 * @contact email:huweiwei1@jd.com erp:huweiwei3 qq:226297845
 */

module.exports = function (gulp, $, settings) {
    gulp.task('imagemin', function() {
        return gulp.src(settings.srcPath + '/img/**/*.*')
                .pipe($.cache($.imagemin({
                    optimizationLevel: settings.pngLevel,   //type：Number  default：3  range：0-7
                    progressive: true,      //type：Boolean default：false 无损压缩jpg图片
                    interlaced: true,       //type：Boolean default：false 隔行扫描gif进行渲染
                    multipass: true         //type：Boolean default：false 多次优化svg直到完全优化
                })))
                .pipe(gulp.dest(settings.distPath + '/img'));
    });
};