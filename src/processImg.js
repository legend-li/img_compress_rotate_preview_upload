(function(window) {

    /**
     * 
     * 作者：混沌传奇
     * 
     * 邮箱地址：iot-pro_lizeng@foxmail.com
     * 
     * 日期：2017-10-26
     * 
     * 插件功能：压缩图片&&纠正图片方向&&返回二进制(Blob)图片元数据组成的列表
     * 
     */

    window.lzImgProcess = function () {


        var Orientation = '', //图片方向角
            blobList = [], //压缩后的二进制图片数据列表

            canvas = document.createElement("canvas"), //用于压缩图片（纠正图片方向）的canvas
            ctx = canvas.getContext('2d'),

            file_type = 'image/jpeg', //图片类型
            qlty = 0.5, //图片压缩品质，默认是0.5，可选范围是0-1的数字类型的值，可配置
            imgWH = 1000; //压缩后的图片的最大宽度和高度，默认是1000px，可配置


        /**
         * @actionName process, 
         *        方法功能：压缩图片&&纠正图片方向&&返回二进制(Blob)图片元数据
         * 
         * @param fileList,传入函数的文件列表对象，fileList对象是来自用户在一个<input>元素上选择文件后返回的FileList对象
         *        注意：图片类型必须是jpeg||png
         *        比如：<input id="uploadImage" onchange="loadImageFile();" /> 
         *              function loadImageFile() {
         *                //获取返回的fileList对象
         *                var fileList = document.getElementById("uploadImage").files;
         *              }
         * @param getBlobList [Blob],获取压缩结果的钩子函数，接受一个参数。
         *        功能：在图片压缩完毕后，获取压缩后的二进制图片数据对象组成的数组，参数即：压缩后的二进制图片数据(blob)组成的list
         *        
         * @param quality,传入函数的图片压缩比率(品质)，可选范围0-1的数字类型的值，默认是0.5
         *
         * @param WH,传入函数的图片压缩后的最大图片宽度和高度，默认是1000，单位是px，可自由配置。
         *        注意：最好不要超过1000，数字过大，容易导致canvas压缩失败。由于没做瓦片处理，所以有这个限制。1000*1000的图片在前端中，基本也够用了。
         *        
         */
        function process (fileList, getBlobList, quality, WH) {
            blobList = []; //初始化blobList
            // 判断参数fileList的长度是否大于0
            if (!fileList.length){
                console.log('警告：传进方法process的参数fileList长度必须大于零！！！')
                return;
            }

            //如果quality参数有值，则把quality赋值给qlty(图片压缩的品质)
            if(quality)
                qlty = quality;

            //如果WH参数有值，则把WH赋值给imgWH（压缩后的图片的最大宽度和高度）
            if(WH&&WH<1000&&WH>0){
                imgWH = WH;
            }

            // 把传进来的fileList转为数组类型
            var files = Array.prototype.slice.call(fileList);
            
            files.forEach(function (file, i) {
                if (!/\/(?:jpeg|png)/i.test(file.type)){
                    console.log('警告：图片必须是jpeg||png类型！！！');
                    return;
                }
                // file_type = file.type;
                
                var reader = new FileReader();

                // 获取图片压缩前大小，打印图片压缩前大小
                var size = file.size/1024 > 1024 ? (~~(10*file.size/1024/1024))/10 + "MB" :  ~~(file.size/1024) + "KB";
                // console.log('size:', size)

                reader.onload = function () {
                    var img = new Image();
                    img.src = this.result;

                    // 图片加载完毕之后进行压缩
                    if (img.complete) {
                        callback();
                    } else {
                        img.onload = callback;
                    }

                    function callback() {
                        //获取照片方向角属性，用户旋转控制  
                        EXIF.getData(img, function() {
                            // alert(EXIF.pretty(this));
                            EXIF.getAllTags(this);   
                            // alert(EXIF.getTag(this, 'Orientation'));
                            Orientation = EXIF.getTag(this, 'Orientation');  
                            if(Orientation == ""||Orientation == undefined||Orientation == null){
                                Orientation = 1;
                            }
                        });

                        //获取压缩后的图片二进制数据
                        var data = GetImgCompress(img);

                        //将二进制数据塞入到二进制数据列表中
                        blobList.push(data);

                        //将压缩后的二进制图片数据对象(blob)组成的list通过钩子函数返回出去
                        if(blobList.length===files.length){
                            if(getBlobList)
                                getBlobList(blobList);
                        }
                        
                        img = null;
                    }

                };

                reader.readAsDataURL(file);
            })
        }


        /**
         * @actionName GetImgCompress,
         *     功能：判断上传图片的方向，如果不是正确的，进行修正，并对图片进行压缩，压缩完后，返回压缩后的二进制图片数据
         *     
         * @param img, 用来压缩的图片对象
         * 
         * @returns 返回的压缩后的二进制图片数据
         */
        function GetImgCompress(img){
            if (navigator.userAgent.match(/iphone/i)) {
                //console.log('iphone');
                //如果方向角不为1，都需要进行旋转
                if(Orientation != "" && Orientation != 1){
                    switch(Orientation){
                        case 6://需要顺时针（向左）90度旋转
                            rotateImg(img,'left',canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            rotateImg(img,'right',canvas);  
                            break;  
                        case 3://需要180度旋转
                            rotateImg(img,'right',canvas);//转两次  
                            rotateImg(img,'right',canvas);
                            break;  
                    }
                }else{
                    //不做旋转
                    rotateImg(img,'no',canvas); 
                }
            }else if (navigator.userAgent.match(/Android/i)) {// 修复android
                if(Orientation != "" && Orientation != 1){
                        switch(Orientation){
                            case 6://需要顺时针（向左）90度旋转
                                rotateImg(img,'left',canvas);
                                break;
                            case 8://需要逆时针（向右）90度旋转
                                rotateImg(img,'right',canvas);
                                break;
                            case 3://需要180度旋转
                                rotateImg(img,'right',canvas);//转两次
                                rotateImg(img,'right',canvas);
                                break;
                        }
                    }else{
                        //不做旋转
                        rotateImg(img,'no',canvas);  
                    }
            }else{
                if(Orientation != "" && Orientation != 1){
                    switch(Orientation){
                        case 6://需要顺时针（向左）90度旋转
                            rotateImg(img,'left',canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            rotateImg(img,'right',canvas);
                            break;
                        case 3://需要180度旋转
                            rotateImg(img,'right',canvas);//转两次
                            rotateImg(img,'right',canvas);
                            break;
                    }
                }else{
                    //不做旋转
                    rotateImg(img,'no',canvas);
                }
            }

            var ndata;
            
            ndata = canvas.toDataURL(file_type, qlty);
            
            //打印压缩前后的大小，以及压缩比率
            // var initSize = img.src.length;
            // console.log('压缩前：' + initSize);
            // console.log('压缩后：' + ndata.length, 'base64数据', ndata);
            // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");


            //将压缩后的base64数据转为二进制数据
            ndata = dataURItoBlob(ndata);

            //清除canvas画布的宽高
            canvas.width = canvas.height = 0;
            
            return ndata;
        }



        /**
         * @actionName rotateImg,
         *     功能：对图片旋转处理
         *     
         * @param img, 用来矫正方向的图片对象
         * 
         * @param direction, 旋转方向
         *
         * @param canvas, 用来绘制图片的cavas画布对象
         */
        function rotateImg(img, direction,canvas) {    
            
            //最小与最大旋转方向，图片旋转4次后回到原方向    
            var min_step = 0;
            var max_step = 3;
            if (img == null)return;    
            //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
            var height = img.height;    
            var width = img.width;

            if(width>imgWH || height>imgWH){
                var ratio = ~~(height/width*10)/10;
                if(width>height){
                    width = imgWH;
                    height = imgWH*ratio;
                }else{
                    height = imgWH;
                    width = height/ratio;
                }
                img.width = width;
                img.height = height;
            }

            canvas.width = width;    
            canvas.height = height;   
            
            // 铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, width, height);

            var step = 2;    
            if (step == null) {    
                step = min_step;    
            }
            if (direction == 'no'){
                step = 0;    
            } else if (direction == 'right') {    
                step++;    
                //旋转到原位置，即超过最大值    
                step > max_step && (step = min_step);    
            } else {    
                step--;    
                step < min_step && (step = max_step);    
            }

            //旋转角度以弧度值为参数    
            var degree = step * 90 * Math.PI / 180; 
            
            switch (step) {
                case 0:
                    ctx.drawImage(img, 0, 0,width,height);   
                    break;    
                case 1:
                    ctx.rotate(degree);    
                    ctx.drawImage(img, 0, -height,width,height);    
                    break;
                case 2:
                    ctx.rotate(degree);    
                    ctx.drawImage(img, -width, -height,width,height);    
                    break;    
                case 3:
                    ctx.rotate(degree);    
                    ctx.drawImage(img, -width, 0,width,height);    
                    break;
            }
        }




        /**
         * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
         * @param dataURI,图片的base64格式数据
         * @returns {Blob}
         */
        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: mimeString});
        }




        /**
         * 返回一个process方法
         * 
         * process方法：用来压缩图片数据，在压缩图片的同时，默认会调用correctOrientation方法纠正图片方向。
         * 
         */
        return process;


    }
})(window)

