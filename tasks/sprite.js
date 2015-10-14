/**
 * images sprite  output css/scss
 *
 * @author  willhu
 * @date    2015-09-01
 * @contact email:huweiwei1@jd.com erp:huweiwei3 qq:226297845
 */

module.exports = function (gulp, $, settings) {
    var fs = require('fs');
    var sizeOf = require('image-size');

    var spriteList = fs.readdirSync(settings.srcPath + '/img/sprite/');

    // retina图片处理
    gulp.task('spriteCut', function () {
        spriteList.forEach(function (spriteItem) {
            var path = settings.srcPath + '/img/sprite/' + spriteItem;
            var states = fs.statSync(path);
            if (states.isDirectory() === true) {
                var spriteItemList = fs.readdirSync(path);
                spriteItemList.forEach(function (imgFile) {
                    var imgPath = path + '/' + imgFile;
                    if (settings.imgRetina === true) {
                        var imgSize = sizeOf(imgPath);
                        var imgW = imgSize.width;
                        var imgH = imgSize.height;
                        if (imgFile.indexOf('@2x') > -1) {
                            if (imgW % 2 === 1 || imgH % 2 === 1) {
                                imgW % 2 === 1 ? imgW -= 1 : imgW;
                                imgW % 2 === 1 ? imgH -= 1 : imgH;
                                return gulp.src(imgPath)
                                .pipe($.gm(function (gmfile) {
                                    return gmfile.resize(imgW, imgH);
                                }, {
                                    imageMagick: true
                                }))
                                .pipe(gulp.dest(path));
                            }
                        }
                    }
                });
            }
        });
    });
    // 图片缩放
    gulp.task('spriteResize', ['spriteCut'], function () {
        spriteList.forEach(function (spriteItem) {
            var path = settings.srcPath + '/img/sprite/' + spriteItem;
            var states = fs.statSync(path);
            if (states.isDirectory() === true) {
                var spriteItemList = fs.readdirSync(path);
                spriteItemList.forEach(function (imgFile) {
                    var imgPath = path + '/' + imgFile;
                    if (settings.imgRetina === true) {
                        var imgSize = sizeOf(imgPath);
                        var imgW = imgSize.width;
                        var imgH = imgSize.height;
                        var imgName = imgFile.split("@2x")[0] + '.png';
                        if (imgFile.indexOf('@2x') > -1) {
                            return gulp.src(imgPath)
                            .pipe($.gm(function (gmfile) {
                                return gmfile.resize(imgW / 2, imgH / 2);
                            }, {
                                imageMagick: true
                            }))
                            .pipe($.rename(imgName))
                            .pipe(gulp.dest(path));
                        }
                    }
                });
            }
        });
    });
    // 图片拼接
    gulp.task('sprite', ['spriteResize'], function () {
        if (spriteList.length > 0) {
            spriteList.forEach(function (spriteFile) {
                if (spriteFile.indexOf('.') < 0) {
                    var spriteData;
                    if (settings.imgRetina === true) {
                        spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
                            .pipe($.spritesmith({
                                retinaSrcFilter: [settings.srcPath + '/img/sprite/' + spriteFile + '/*@2x.png'],
                                imgName: spriteFile + '.png',
                                retinaImgName: spriteFile + '@2x.png',
                                cssName: '_' + spriteFile + '.scss',
                                imgPath: '/img/sprite',
                                padding: 2
                            })
                        );
                        spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
                        spriteData.css.pipe(gulp.dest(settings.srcPath + '/scss/sprite/'));
                    } else {
                        spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
                            .pipe($.spritesmith({
                                imgName: spriteFile + '.png',
                                cssName: '_' + spriteFile + '.scss',
                                imgPath: '/img/sprite',
                                padding: 2
                            })
                        );
                        spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
                        spriteData.css.pipe(gulp.dest(settings.srcPath + '/scss/sprite/'));
                    }
                }
            });
        } else {
            console.log('hey man,there is no images');
        }
    });
    // 图片处理
    //gulp.task('resize', function () {
    //    spriteList.forEach(function (spriteItem) {
    //        var path = settings.srcPath + '/img/sprite/' + spriteItem;
    //        var states = fs.statSync(path);
    //        if (states.isDirectory() === true) {
    //            var spriteItemList = fs.readdirSync(path);
    //            spriteItemList.forEach(function (imgFile) {
    //                var imgPath = path + '/' + imgFile;
    //                if (settings.imgRetina === true) {
    //                    var spriteData;
    //                    var imgSize = sizeOf(imgPath);
    //                    var imgW = imgSize.width;
    //                    var imgH = imgSize.height;
    //                    var imgName = imgFile.split("@2x")[0] + '.png';
    //                    if (imgFile.indexOf('@2x') > -1) {
    //                        if (imgW % 2 === 1 || imgH % 2 === 1) {
    //                            imgW % 2 === 1 ? imgW -= 1 : imgW;
    //                            imgW % 2 === 1 ? imgH -= 1 : imgH;
    //                            gulp.src(imgPath)
    //                                .pipe($.gm(function (gmfile) {
    //                                    return gmfile.resize(imgW, imgH);
    //                                }, {
    //                                    imageMagick: true
    //                                }))
    //                                .pipe(gulp.dest(path));
    //
    //                            gulp.src(imgPath)
    //                                .pipe($.gm(function (gmfile) {
    //                                    return gmfile.resize(imgW / 2, imgH / 2);
    //                                }, {
    //                                    imageMagick: true
    //                                }))
    //                                .pipe($.rename(imgName))
    //                                .pipe(gulp.dest(path));
    //                        } else {
    //                            gulp.src(imgPath)
    //                                .pipe($.gm(function (gmfile) {
    //                                    return gmfile.resize(imgW / 2, imgH / 2);
    //                                }, {
    //                                    imageMagick: true
    //                                }))
    //                                .pipe($.rename(imgName))
    //                                .pipe(gulp.dest(path));
    //                        }
    //                    }
    //                }
    //            });
    //        }
    //    });
    //});
    ////图片拼接
    //gulp.task('sprite', ['resize'], function () {
    //    if (spriteList.length > 0) {
    //        spriteList.forEach(function (spriteFile) {
    //            if (spriteFile.indexOf('.') < 0) {
    //                var spriteData;
    //                if (settings.imgRetina === true) {
    //                    spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
    //                        .pipe($.spritesmith({
    //                            retinaSrcFilter: [settings.srcPath + '/img/sprite/' + spriteFile + '/*@2x.png'],
    //                            imgName: spriteFile + '.png',
    //                            retinaImgName: spriteFile + '@2x.png',
    //                            cssName: '_' + spriteFile + '.scss',
    //                            padding: 2
    //                        })
    //                    );
    //                    spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
    //                    spriteData.css.pipe(gulp.dest(settings.srcPath + '/stylesheet/scss/sprite/'));
    //                } else {
    //                    spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
    //                        .pipe($.spritesmith({
    //                            imgName: spriteFile + '.png',
    //                            cssName: '_' + spriteFile + '.scss',
    //                            padding: 2
    //                        })
    //                    );
    //                    spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
    //                    spriteData.css.pipe(gulp.dest(settings.srcPath + '/stylesheet/scss/sprite/'));
    //                }
    //            }
    //        });
    //    } else {
    //        console.log('hey man,there is no images');
    //    }
    //});
    //gulp.task('sprite', function() {
    //    var spriteList = fs.readdirSync(settings.srcPath + '/img/sprite/');
    //    if (spriteList.length > 0) {
    //        spriteList.forEach(function(spriteFile) {
    //            if (spriteFile.indexOf('.') < 0) {
    //                var spriteData;
    //                if (settings.imgRetina === true) {
    //                    spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
    //                        .pipe($.spritesmith({
    //                            retinaSrcFilter: [settings.srcPath + '/img/sprite/' + spriteFile + '/*@2x.png'],
    //                            imgName: spriteFile + '.png',
    //                            retinaImgName: spriteFile + '@2x.png',
    //                            cssName: '_' + spriteFile + '.scss',
    //                            padding: 2
    //                        })
    //                    );
    //                    spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
    //                    spriteData.css.pipe(gulp.dest(settings.srcPath + '/stylesheet/scss/sprite/'));
    //                } else {
    //                    spriteData = gulp.src(settings.srcPath + '/img/sprite/' + spriteFile + '/*.png')
    //                        .pipe($.spritesmith({
    //                            imgName: spriteFile + '.png',
    //                            cssName: '_' + spriteFile + '.scss',
    //                            padding: 2
    //                        })
    //                    );
    //                    spriteData.img.pipe(gulp.dest(settings.srcPath + '/img/sprite/'));
    //                    spriteData.css.pipe(gulp.dest(settings.srcPath + '/stylesheet/scss/sprite/'));
    //                }
    //            }
    //        });
    //    } else {
    //        console.log('hey man,there is no images');
    //    }
    //
    //});
};