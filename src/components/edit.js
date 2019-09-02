export default{
    data(){
        return {
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