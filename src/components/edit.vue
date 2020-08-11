<template>
  <div class="edit-box">
    <el-dialog
      class="edit-dialog"
      :visible="visible"
      :fullscreen="true"
      :before-close="handleClose"
      @opened="afterOpen"
    >
      <el-container>
        <el-aside class="left-side">
          <div class="item-info" v-if="item">
            <p>尺寸:{{parseInt(item.imageInfo.w*(scaleVal/100))}}*{{parseInt(item.imageInfo.h*(scaleVal/100))}}</p>
            <p>文件名：{{item.imageInfo.name}}</p>
            <p>
              修改时间:{{dateFormat(item.imageInfo.modifyTime)}}
            </p>
            <p>
              文件大小:{{byteSize(item.imageInfo.size)}}
            </p>
          </div>
          <el-slider @input="changeScale" :format-tooltip="scaleTips" :max="300" :min="10" v-model="scaleVal"></el-slider>
          <el-slider @change="changeGrey" :format-tooltip="greyTips" :max="10" :min="0" v-model="greyVal"></el-slider>
          <div style="margin-bottom:20px;">
            <el-button type="primary" @click="setRGBMode" icon="el-icon-edit">{{mode=='rgb'?'取消取色':'取色'}}</el-button>
            <div class="rgb-cell" v-show="mode==='rgb'">
              <div :style="{backgroundColor:'#'+rgb}" class="rgb-span"></div>
              <p>#{{rgb}}</p>
              <p>rgba({{r}},{{g}},{{b}},{{a}})</p>
            </div>
          </div>
          <el-button type="success" @click="strImg">导出图片字符</el-button>
          <el-button type="success" @click="openExport">导出图片</el-button>
        </el-aside>
        <el-main class="edit-con">
          <canvas :class="{'get-rgb':mode=='rgb'}" @click="clickCanvas" id="canvas"></canvas>
        </el-main>
      </el-container>
    </el-dialog>
    <el-dialog
      class="str-dialog"
      :fullscreen="true"
      :before-close="handleStrClose"
      :visible="strVisible"
    >
      <pre v-if="strImgs!==''" class="str-con">
        {{strImgs}}
      </pre>
    </el-dialog>
    <export-dialog ref="exportDialog"/>
  </div>
</template>

<script>
import exportDialog from './export-dialog'
import mixin from './edit'
export default {
  name: 'editDialog',
  data(){
    return{
      ctx:null,
      canvas:null,
      visible:false,
      item:null
    }
  },
  mixins:[mixin],
  props: {
    msg: String
  },
  components:{
    exportDialog
  },
  methods:{
    setRGBMode(){
      if(this.mode==='rgb'){
        this.mode=''
      }else{
        this.mode='rgb'
      }
    },
    openExport(){
      this.$refs.exportDialog.init(this.canvas,this.item.imageInfo)
    },
    scaleTips(val){
      return '缩放'+val+'%';
    },
    greyTips(val){
      return '灰度'+val
    },
    handleStrClose(){
      this.strVisible=false;
    },
    handleClose(){
      this.visible=false
    },
    changeScale(val){
      this.scaleVal=val
      this.drawImg()
    },
    changeGrey(val){
      this.greyVal=val
      this.drawImg()
    },
    init(item){
      this.visible=true
      this.item=item
      this.scaleVal=100
      this.greyVal=0
    },
    afterOpen(){
      if(!this.canvas){
        this.canvas=document.querySelector('#canvas')
        this.ctx=this.canvas.getContext("2d")
      }
      this.drawImg()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import './edit.scss';
.str-dialog{
  text-align:center;
}
.str-con{
  border:1px solid #333;
  display:inline-block;
}
</style>
