<template>
  <div class="home-page">
    <el-upload
      class="upload-btn"
      drag
      action
      multiple
      :before-upload="beforeUpload"
      :on-change="fileChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="img-list">
      <div class="img-item" v-for="(item,index) in fileList" :key="index">
        <div class="img-cell">
          <img class="img-el" :title="item.imageInfo.name" :src="item.imageSrc"/>
        </div>
        <div class="img-info">
          <p>文件名：{{item.imageInfo.name}}</p>
          <p>尺寸：{{item.imageInfo.w}}*{{item.imageInfo.h}}</p>
          <p>
            修改时间:{{dateFormat(item.imageInfo.modifyTime)}}
          </p>
          <p>
            文件大小:{{byteSize(item.imageInfo.size)}}
          </p>
        </div>
        <div class="btns">
          <div class="danger btn" @click="toDel(index)">删除</div>
          <div class="primary btn" @click="toEdit(item)">编辑</div>
        </div>
      </div>
    </div>
    <edit-dialog ref="editDialog"/>
  </div>
</template>

<script>
// @ is an alias to /src
import EditDialog from '@/components/edit'
export default {
  name: 'home',
  data(){
    return{
      fileList:[]
    }
  },
  components: {
    EditDialog
  },
  methods:{
    toDel(index){
      this.fileList.splice(index,1)
    },
    toEdit(item){
        this.$refs.editDialog.init(item)
    },
    beforeUpload(){
      return false
    },
    handleRemove(file, fileList){
      console.warn('rm',file,fileList)
    },
    readFile(file,index){
      let fileReader= new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload=(evt)=>{
        var imgEle = new Image()
        imgEle.src = evt.target.result
        imgEle.onload =()=>{
          var nW = imgEle.naturalWidth
          var nH = imgEle.naturalHeight
          this.fileList[index].imageInfo.w=nW
          this.fileList[index].imageInfo.h=nH
          this.fileList[index].imageSrc=evt.target.result
        }
      }
    },
    fileChange(file, fileList){
      console.warn('preview',file,fileList)
      this.fileList.push({
        file: file.raw,
        imageInfo:{
          w:'',
          h:'',
          name:file.raw.name,
          size:file.raw.size,
          modifyTime:file.raw.lastModified
        },
        imageSrc:null
      })
      this.readFile(file.raw,this.fileList.length-1)
    },
    async init(){

    }
  },
  mounted(){
    this.init()
  }
}
</script>
<style lang="scss">
@import './index.scss';
.el-upload-dragger{
      background-color: transparent;
      color: #eee;
      .el-upload__text{
          color:#eee;
      }
  }
</style>
