define(function(require) {
    var Config = require('config');
    require('../tools/jquery.slideBar');
    var rgbToHex = function(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    }; //rgb装换为16进制
    window.byteConvert = function(bytes) {
        if (bytes < 1000) return bytes + 'B';
        var k = 1000, // 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };
    var imagesBin = function(contentEle, inputEle) {
        console.log('run');
        var c = document.getElementById("j-canvas");
        this.init();
        this.canvas = c;
        this.inputEle = inputEle;
        this.delIndex = [];
        //this.readerList = [];
        this.fileList = [];
        this.editEle = typeof editEle === undefined ? editEle : document.getElementById("j-editBox");
        this.ctx = c.getContext("2d");
        this.editMode = null; //当前编辑模式，取色：rgb，截屏：cut
        this.nowImg; //当前的图片对象
        var _this = this;
        var pushInputFile = function(e) {
            var files = e.target.files || e.dataTransfer.files;
            for (var i = 0; i < files.length; i++) {
                _this.fileList.push({
                    file: files[i],
                    reader: new FileReader()
                });
            }
            return files;
        };
        var drawImg = function(img, w, h) { //重新绘制图片到canvas上
            _this.ctx.clearRect(0, 0, c.width, c.height);
            c.setAttribute('width', w);
            c.setAttribute('height', h);
            _this.ctx.drawImage(img, 0, 0, w, h);
            _this.originImgData = _this.ctx.getImageData(0, 0, w, h); //保存图片的元素像素点
            editImgSize.innerText = parseInt(w) + 'x' + parseInt(h);
            greyEle.value=0;//把灰度值置为0
        };
        var imgGrey = function(v) {
            var context = _this.ctx;
            var imagedata = new ImageData(_this.originImgData.width, _this.originImgData.height);
            imagedata.data.set(_this.originImgData.data);
            var pix = imagedata.data;
            if (v !== '0') {
                v=1/v;
                for (var i = 0, n = pix.length; i < n; i += 4) {
                    var grayscale = pix[i] * 0.3 * v + pix[i + 1] * 0.59 * v + pix[i + 2] * 0.11 * v;
                    pix[i] = grayscale; // red
                    pix[i + 1] = grayscale; // green
                    pix[i + 2] = grayscale; // blue
                }
            }
            context.putImageData(imagedata, 0, 0);
        };
        var showEditBox = function(img) {
            _this.editEle.className = _this.editEle.className.replace('hidden', '') + ' show';
            document.body.className = "overflow-hidden";
            _this.nowImg = img;
            editImgName.innerText = img.getAttribute('title');
            $("#slider2").slideBar({ //输出品质
                max: 100,
                min: 10,
                crossC: "#3ef",
                handlerC: '#f70',
                defalutNum: 100
            });
            if ($('input[name=slider1]').val() === '') { //初始化滑动插件
                $("#slider1").slideBar({
                    max: 300,
                    min: 10,
                    crossC: "#3ef",
                    handlerC: '#f70',
                    defalutNum: 100,
                    callBack: function(v) {
                        drawImg(_this.nowImg, _this.nowImg.naturalWidth * (v / 100), _this.nowImg.naturalHeight * (v / 100));
                    }
                });
            } else {
                $('input[name=slider1]').val('100').trigger('change');
            }
        };
        var hideEditBox = function() {
            document.body.className = " ";
            _this.editEle.className = _this.editEle.className.replace('show', '') + ' hidden';
        };
        var onFileLoad = function(evt, index) {
            var frag = document.createDocumentFragment();
            var imgEle = new Image();
            var imgWrap = document.createElement('div');
            var btnsWrap = document.createElement('div');
            var textCell = document.createElement('div');
            var closeBtn = document.createElement('span');
            var editBtn = document.createElement('span');
            imgWrap.className = "img-box";
            btnsWrap.className = "btns-cell";
            textCell.className = "text-cell";
            editBtn.className = "btn btn-primary";
            closeBtn.className = "glyphicon glyphicon-remove";
            imgEle.src = evt.target.result;
            imgEle.onload = function() {
                var nW = imgEle.naturalWidth;
                var nH = imgEle.naturalHeight;
                var data = {
                    'nW': nW,
                    'nH': nH,
                    'index': index,
                    'size': _this.fileList[index].file.size,
                    'name': _this.fileList[index].file.name,
                    'modifiedTime': _this.fileList[index].file.lastModified
                };
                imgEle.setAttribute('title', _this.fileList[index].file.name);
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var parent = this.parentNode;
                    parent.parentNode.removeChild(parent);
                    _this.delIndex.push(index);
                    //e.target.parentNode.removeNode(true);
                }, false);
                editBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showEditBox(imgEle);
                }, false);
                closeBtn.innerHTML = '删除';
                editBtn.innerHTML = '编辑';
                textCell.innerHTML = D.utils.render(document.getElementById('t-imgText').innerHTML, data);
                imgWrap.appendChild(closeBtn);
                btnsWrap.appendChild(editBtn);
                imgWrap.appendChild(imgEle);
                imgWrap.appendChild(textCell);
                imgWrap.appendChild(btnsWrap);
                frag.appendChild(imgWrap);
                contentEle.appendChild(frag);
            }
        };
        var onSelected = function(files) {
            var isAppend = false; //判断是否是追加的文件
            if (files.length < _this.fileList.length) {
                isAppend = true;
            }
            for (var i = 0; i < files.length; i++) {
                var index = i;
                if (isAppend) {
                    index = (_this.fileList.length - files.length) + i;
                }

                (function(j) {
                    _this.fileList[j].reader.onload = function(evt) {
                        console.log(evt);
                        console.log(j);
                        onFileLoad(evt, j);
                    }
                })(index);
                _this.fileList[index].reader.readAsDataURL(files[i]);
            }
        };
        /**
         * 在本地进行文件保存
         * @param  {String} data     要保存到本地的图片数据
         * @param  {String} filename 文件名
         */
        var saveFile = function(data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };

        //编辑界面的按钮
        var editCloseBtn = document.getElementById('j-editClose');
        var getColorBtn = document.getElementById('j-getColor');
        var getCutBtn = document.getElementById('j-getCut');
        var downPicBtn = document.getElementById('j-downPic');
        var colorHex = document.getElementById('j-colorHex');
        var colorPicker = document.getElementById('j-colorPicker');
        var editImgName = document.getElementById('j-editImgName');
        var editImgSize = document.getElementById('j-editImgSize');
        var greyEle=document.getElementById('j-grey');
        //var downLinkEle=document.getElementById('j-link');
        var outputEle = {
            quality: document.querySelector('input[name=imgQuality]'),
            name: document.querySelector('input[name=imgName]')
            // type:document.querySelector('input[name=imgType]:checked')//动态元素不可缓存
        }
        greyEle.addEventListener('change',function(e){
            console.log('grey');
            var greyVal=greyEle.value;
            if(greyVal<0){
                greyEle.value=0;
            }else{
                imgGrey(parseInt(greyEle.value));
            }
        });
        downPicBtn.addEventListener('click', function(e) {
            var imgData = {
                quality: parseInt(outputEle.quality.value) / 100,
                name: outputEle.name.value,
                type: document.querySelector('input[name=imgType]:checked').value
            }
            var newImg = c.toDataURL(imgData.type, imgData.quality);
            var imgName;
            switch (imgData.type) {
                case 'image/jpeg':
                    imgName = imgData.name + '.jpg';
                    break;
                case 'image/png':
                    imgName = imgData.name + '.png';
                    break;
                default:
                    imgName = imgData.name + '.jpg';
            }
            saveFile(newImg, imgName);
            //downLinkEle.innerHTML='<a href="' + newImg + '" download="' + imgName + '">-&gt;点击此下载链接</a>';
        }, false);
        getColorBtn.addEventListener('click', function(e) {
            if (_this.editMode !== 'rgb') {
                _this.editMode = 'rgb';
                this.innerHTML = '取消取色';
            } else {
                _this.editMode = null;
                this.innerHTML = '取色';
            }

        }, false);
        editCloseBtn.addEventListener('click', function() {
            hideEditBox();
        }, false);
        c.addEventListener('click', function(e) {
            //console.log(e);
            if (_this.editMode === 'rgb') {
                var imgData = _this.ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
                var r = imgData[0];
                var g = imgData[1];
                var b = imgData[2];
                var a = imgData[3];
                colorPicker.style.backgroundColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                colorHex.innerHTML = '<p>#' + rgbToHex(r, g, b) + '</p><p>rgba(' + r + ',' + g + ',' + b + ',' + a + ')</p>';
                console.log(rgbToHex(r, g, b));
            }

        }, false);
        this.inputEle.addEventListener('change', function(e) {
            var files = pushInputFile(e);
            onSelected(files);
        }, false);

    };
    imagesBin.prototype = {
        init: (function() {
            if (typeof(FileReader) !== undefined) {
                console.log('支持');
            } else {
                alert('你的浏览器已经out了，请升级你的浏览器（推荐chrome浏览器）');
                return false;
            }
        })
    }
    return imagesBin;
});
