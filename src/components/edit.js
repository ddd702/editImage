export default{
    data(){
        return {
            strVisible:false,
            strImgs:'',
            r:0,
            g:0,
            b:0,
            a:0,
            rgb:'',
            mode:'',
            scaleVal:100,
            originImgData:null,
            greyVal:0,//灰度值
        }
    },
    methods:{
        rgbToHex(r, g, b) {
            return ((r << 16) | (g << 8) | b).toString(16);
        }, //rgb装换为16进制
        drawImg() { //重新绘制图片到canvas上
            if(!this.ctx){
                console.log('canvas节点尚未初始化')
                return
            }
            let w= this.item.imageInfo.w*(this.scaleVal/100)
            let h= this.item.imageInfo.h*(this.scaleVal/100)
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height)
            this.canvas.setAttribute('width', w)
            this.canvas.setAttribute('height', h)
            this.ctx.drawImage(this.item.imageEl, 0, 0, w, h)
            this.originImgData = this.ctx.getImageData(0, 0, w,h) //保存图片的元素像素点
            this.imgGrey()
        },
        clickCanvas(e){
            if(this.mode==='rgb'){
                var imgData = this.ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data
                var r = imgData[0]
                var g = imgData[1]
                var b = imgData[2]
                var a = imgData[3]
                this.rgb=this.rgbToHex(r, g, b)
                this.r=r
                this.g=g
                this.b=b
                this.a=(a/255).toFixed(1)
            }
        },
        strImg(){
            const FONT_HEIGHT = 10
            const FONT_WIDTH = 5
            let drawStrs='$%^&*+.-0~ad1i'
            var outStr = []
            var imagedata = new ImageData(this.originImgData.width, this.originImgData.height)
            imagedata.data.set(this.originImgData.data)
            var pix = imagedata.data
            let v=1//先置为灰度才耍
            let width= imagedata.width
            let height= imagedata.height
            //开始间隔取色
            for (let h = 0; h < height; h += FONT_HEIGHT) {
                let lineStr = ''
                for (let w = 0; w < width; w += FONT_WIDTH) {
                    let i=(w + width * h) * 4
                    var grayscale = pix[i] * 0.3 * v + pix[i + 1] * 0.59 * v + pix[i + 2] * 0.11 * v
                    if(grayscale>200){
                        lineStr+=' '
                    }else{
                        let gap=(255-grayscale)/255
                        lineStr+=drawStrs.charAt(Math.round(gap*(drawStrs.length-1)))
                    }
                }
                outStr.push(lineStr)
            }
            this.strImgs=outStr.join('\n')
            this.strVisible=true
        },
        imgGrey() {
            let v=parseFloat(this.greyVal)
            if(!this.ctx){
                console.log('canvas节点尚未初始化')
                return
            }
            var imagedata = new ImageData(this.originImgData.width, this.originImgData.height)
            imagedata.data.set(this.originImgData.data)
            var pix = imagedata.data
            if (v !== 0) {
                v=1/v;
                for (var i = 0, n = pix.length; i < n; i += 4) {
                    var grayscale = pix[i] * 0.3 * v + pix[i + 1] * 0.59 * v + pix[i + 2] * 0.11 * v
                    pix[i] = grayscale // red
                    pix[i + 1] = grayscale // green
                    pix[i + 2] = grayscale // blue
                }
            }
            this.ctx.putImageData(imagedata, 0, 0)
        }
    }
    
}