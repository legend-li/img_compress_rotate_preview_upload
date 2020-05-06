前端实现：图片压缩，图片旋转矫正方向，图片预览，图片二进制数据流上传

# 项目运行方法：
 1.clone项目到本地电脑
 
 2.进入项目根目录
 
 3.双击ImgProcess.html，即可在浏览器运行demo了。

# 项目中主要插件是：
 <b>src/processImg.js 和 src/exif.js</b>

 这两个插件是用来实现图片压缩和图片方向纠正的。
 
 processImg.js依赖于exif.js，所以在使用的时候，必须先引入exif.js，然后再引入processImg.js
 
 插件processImg.js和exif.js都是原生js编写的。所以不依赖第三方库，可以直接在任何前端项目中使用。
 
 只需要先将exif.js引入，然后再将processImg.js引入即可。

 exif.js 提供了 JavaScript 读取图像的原始数据的功能扩展，例如：拍照方向、相机设备型号、拍摄时间、ISO 感光度、GPS 地理位置等数据。

 Exif.js 的 github 仓库地址：[https://github.com/exif-js/exif-js/](https://github.com/exif-js/exif-js/)

# 浏览器兼容性：
 插件的浏览器兼容性：IE10+，IE10以下的浏览器可能不兼容

# 插件详细讲解：
 文章地址：[https://juejin.im/post/5a9759a16fb9a0635b5360b3](https://juejin.im/post/5a9759a16fb9a0635b5360b3)

> 声明：这个插件的初衷是教会大家如何自己编写图片压缩、方向纠正插件。上传和预览不是重点，重点是如何压缩和纠正方向，所以上传和预览没有放在插件processImg本身中，而是写在了demo中。




# 最后
前端在获取到用户上传的图片之后，有时图片过大需要压缩，html5图片压缩主要是通过canvas来处理。但是在ios中存在几个问题：

- 首先是图片的大小，如果图片的大小超过两百万像素，图片是无法绘制到canvas上的，调用drawImage的时候不会报错，但是你用toDataURL获取图片数据的时候获取到的是空的图片数据。

- 再者就是canvas的大小有限制，如果canvas的大小大于大概五百万像素（即宽高乘积）的时候，不仅图片画不出来，其他什么东西也都是画不出来的。

解决办法：

- 问题1解决办法是将图片分割成多块绘制到canvas上

- 问题2对图片的宽高进行适当压缩，保证处于canvas的最大大小限制以内（大概500万像素以内），更早期的手机甚至限制canvas最大大小为300万像素左右，这个早起手机就不用理会了，毕竟用的人不多。
