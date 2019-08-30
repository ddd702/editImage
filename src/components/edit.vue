<template>
  <div class="edit-box">
    <el-dialog
      :visible="visible"
      :fullscreen="true"
      :before-close="handleClose"
    >

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editDialog',
  data(){
    return{
      visible:false,
      item:null
    }
  },
  props: {
    msg: String
  },
  methods:{
    handleClose(){
      this.visible=false
    },
    init(item){
      this.visible=true
      this.item=item
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.edit-box{
  .el-dialog{
    background: rgba($color: #000000, $alpha:0.7);
  }
  .el-dialog__headerbtn .el-dialog__close{
    color:#eee;
    font-size: 30px;
  }
}
  
</style>
