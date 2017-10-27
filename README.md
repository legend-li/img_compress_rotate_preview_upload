前端实现：图片压缩，图片旋转矫正方向，图片预览，图片二进制数据流上传

# 项目运行方法：
 1.clone项目到本地电脑
 
 2.进入项目根目录
 
 3.双击imgCompressRotate.html，即可在浏览器运行demo了。

# 项目中主要插件是：
## src/compressImg.js 和 src/exif.js

 这两个插件是用来实现图片压缩和图片方向纠正的。
 
 compressImg.js依赖于exif.js，所以在使用的时候，必须先引入exif.js，然后再引入compressImg.js
 
 插件compressImg.js和exif.js都是原生js编写的。所以不依赖第三方库，可以直接在任何前端项目中使用。
 
 只需要先将exif.js引入，然后再将compressImg.js引入即可。
