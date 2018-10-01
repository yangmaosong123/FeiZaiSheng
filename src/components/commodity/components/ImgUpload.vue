<template>
<div>
    <el-upload ref="imgCtl" prop="fileId" :limit="4" :action="$store.state.fileUploadUrl" list-type="picture-card" :on-remove="remove" :before-upload="check" :on-success='upload'>
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
            fileUid: [],
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
            if(this.fileId.length==0){
                this.$refs.imgCtl.clearFiles();
            }
        }
    },
    created() {},
    methods: {
        remove: function (file) {
            var index = this.fileUid.indexOf(file.uid);
            this.fileId.splice(index, 1);
            this.fileUid.splice(index, 1);
        },
        upload: function (res, file) {
            this.fileUid.push(file.uid);
            this.fileId.push(res.data);
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
