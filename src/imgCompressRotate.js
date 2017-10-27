(function(){
	var fileinfo = document.getElementById("fileinfo");
    var filechooser = document.getElementById("choose");
	
    var blobFileList;

    $("#addImg").on("click", function () {
        filechooser.click();
    });
    $("#addImg,#submit").on("touchstart mouseenter", function () {
        $(this).addClass("touch")
    })
    .on("touchend mouseleave", function () {
        $(this).removeClass("touch")
    });

    //上传图片
	$("#submit").on("click",function(){
        if(blobFileList){
            blobFileList.forEach(function (blobFile, i) {
                console.log('正在上传第'+i+'张图片')
                formUpData(blobFile);
            })
        }
	})

    //获取压缩后的图片
    function getCompressiveFileList(fileList) {
        blobFileList = fileList;
        console.log('fileBlobList:', fileList);
        fileList.forEach(function (blob, i) {
            var reader = new FileReader();
            reader.onload = function () {
                $('.imgCompress_list').append('<li style="background-image:url('+this.result+')">');
            }
            reader.readAsDataURL(blob);
        })
    }
	
    //监听上传组件input的onchange事件，压缩图片，纠正图片方向，同时获取压缩后的图片
    filechooser.onchange = function () {
        var fileList = this.files;
        console.log('fileList:', fileList);
        var files = Array.prototype.slice.call(fileList);
        files.forEach(function (file, i) {
            var reader = new FileReader();
            reader.onload = function () {
                $('.img_list').append('<li style="background-image:url('+this.result+')">');
            }
            reader.readAsDataURL(file);
        });
        window.compress(fileList, getCompressiveFileList);
    }

    
    //上传压缩后的二进制图片数据流
    //注意：上传的是二进制数据流，后台接口接收的时候，也要按照二进制数据流接收
    function formUpData(blobFile){
        console.log('blobFile:', blobFile)
    	var xhr = new XMLHttpRequest();
    	
        //链接你自己上传图片接口即可，这里的接口地址，是我写的示例，不可真是使用，讲解意义更大
        xhr.open('post', 'http://xxx/welcome/index/');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                	console.log('上传成功！');
            }
        };

        xhr.send(blobFile);
    }
})();
