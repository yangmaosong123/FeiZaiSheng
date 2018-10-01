<template>
<!-- 确定订单弹框 -->
<el-dialog title="确定订单" center :visible.sync="show" width="30%">
    <span style="text-align: center;padding-left:40%;">是否同意该订单！</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmOrder('N')">不同意</el-button>
        <el-button type="primary" @click="handleConfirmOrder('Y')">同意</el-button>
      </span>
</el-dialog>
</template>

<script>
export default {
    name: "confirmPayment",
    data() {
        return { 
            show: true, 
        };
    },
    computed: {},
    created() {

    },
    mounted: function () { 
    },
    watch:{
        "show":function(){
            
            if(this.show==false){
                this.$emit('cancel'); 
            }
        },
    },
    methods: {
         
        handleConfirmOrder: function (flag) {
            let _this = this;
            _this.$axios({
                method: "post",
                url: _this.$store.state.recycleAddr + "/recOrder/confirmOrder",
                data: {
                    id: _this.id,
                    yesOrNo: flag
                }
            }).then((res) => {
                if (res.data.status === 200) {                    
                    _this.$emit('after-save',flag);
                }
            })

        }     

    },
    props: ["id"]
};
</script>
