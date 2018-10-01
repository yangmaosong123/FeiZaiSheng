<template>
<div>
    <el-upload ref="imgCtl" :file-list="fileList" :limit="4" :action="$store.state.fileUploadUrl" list-type="picture-card" :on-remove="remove" :before-upload="check" :on-success='upload'>
    <i class="el-icon-plus"></i>
</el-upload>
<span>最多只能上传4张{{imgType}}类型的图片</span>
</div>

</template>

<script>
export default {
    name: 'ImageUpload',
    props: ["fileId"],
    data() {
        return {            
            fileList: []
        };
    },
    computed:{
        imgType:function(){
            var sz=this.$store.state.dictionary.def_img_type;
            var strSz=[];
            for(var i=0;i<sz.length;i++){
                strSz.push(sz[i].title);
            }
            return strSz.join("、");
        },
    },    
    watch:{
        'fileId':function(){
            this.fileList=[];
            if(!this.fileId || this.fileId.length==0){
                
            }
            else{
                var sz=this.fileId.split(",");
                for(var i=0;i<sz.length;i++){                    
                    this.fileList.push({ url: this.$store.state.outputImgByIdUrl+sz[i],"id":sz[i]});
                }
            }
        }
    },
    created() {},
    methods: {
        remove: function (file) {
             for(var i=0;i<this.fileList.length;i++){
                if(this.fileList[i].url==file.url){
                    this.fileList.splice(i,1);
                    break;
                }
            }            
            this.$emit('after-change', this.concatId());
        },
        //把id连成字符串
        concatId(){
            var sz=[];
            for(var i=0;i<this.fileList.length;i++){
                sz.push(this.fileList[i].id);
            }
            return sz.join(",")
        },
        upload: function (res, file) {
            this.fileList.push({ url: this.$store.state.outputImgByIdUrl+res.data,id:res.data})            
            this.$emit('after-change', this.concatId());
        },
        //上传文件格式限制
        check: function (file) {                        
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (this.checkImgType( file.type)==false) {
                this.$message.error('不支持的图片类型');
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return false;
            }
            return true;
        },
    }
};
</script>
