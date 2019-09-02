<template>
    <div class="export-box">
        <el-dialog
            title="图片导出"
            :visible.sync="visible"
            width="30%"
        >
            <el-form ref="form" label-position="top" :model="form">
                <el-form-item label="图片名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="图片格式">
                    <el-radio-group v-model="form.format">
                        <el-radio  label="image/jpeg">jpg</el-radio>
                        <el-radio label="image/png">png</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片品质(对png格式图片无效)">
                    <div style="padding:40px;">
                    <el-slider :max="100" v-model="form.quality"></el-slider>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveImg">导出</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                name:'',
                format:'image/jpeg',
                quality:100,
            },
            visible:false,
            canvas:null
        }
    },
    methods:{
        saveImg(){
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
            }
            var imgData = {
                quality: parseInt(this.quality) / 100,
                name: this.form.name,
                type: this.form.format
            }
            var newImg = this.canvas.toDataURL(imgData.type, imgData.quality)
            var imgName
            switch (imgData.type) {
                case 'image/jpeg':
                    imgName = imgData.name + '.jpg'
                    break;
                case 'image/png':
                    imgName = imgData.name + '.png'
                    break;
                default:
                    imgName = imgData.name + '.jpg'
            }
            saveFile(newImg, imgName)
        },
        init(item,img){
            this.canvas=item
            this.visible=true
            this.format='jpg'
            this.quality=100
            this.name=""
            this.form.name=img.name
        }
    },
    mounted(){

    }
}
</script>
<style lang="scss">
.export-box{
    .el-form-item__label{
        font-size: 12px;
    }
}

</style>
    