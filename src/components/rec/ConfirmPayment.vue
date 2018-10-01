<template>
<el-dialog title="请确认交易信息" :visible.sync="show" width="30%">
      <el-form  class="demo-ruleForm"
               label-width="100px"
               >
        <el-form-item label="交易标题：">
          <h3>
            【{{tradeType=='buy'?'求购':'出售'}}】
            {{productTitle}}</h3>
        </el-form-item>
        <el-form-item label="交易数量：" prop="quantity">
             <el-row>
                    <el-col :span="18"><el-input v-model.number="paymentData.tradeQuantity" disabled style=" width: 90%;"></el-input></el-col>
                    <el-col :span="6">{{unit}}</el-col>
                </el-row> 
          
        </el-form-item>
        <el-form-item label="交易单价：" prop="price">
          <el-input v-model="paymentData.tradePrice"  disabled style=" width: 67%;"></el-input>
        </el-form-item>
        <el-form-item label="交易总额：">
          <span>￥{{paymentData.tradeAmount}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="startPay">确 定
        </el-button>
      </div>
    </el-dialog>
</template>


<script>
export default {
    name: "confirmPayment",
    data() {        
        return {
            form: {                
                id:0,
            },  
            show:true,
            paymentData:{
                tradeQuantity:"",
                tradePrice:"",
                tradeAmount:"",
            },
        };
    },
    computed: { 
    },
    created() {         
    },

      watch:{
        "show":function(){            
            if(this.show==false){                
                this.$emit('hide');
            }
        },
    },

    
    mounted:function(){
        this.show=true;
         this.getPaymentInfo();
    },
    methods: {
        cancel:function(){
             this.show=false;
        },
        getPaymentInfo:function(){
            this.form.id=this.id;
            var _this=this;
            this.$axios({
                        method: "post",                       
                        url: _this.$store.state.recycleAddr + "/recOrder/getPaymentInfo",
                        data: _this.form
                    }).then((res) => {
                        if (res.data.status === 200) {   
                            _this.paymentData=res.data.data;                                                                      
                        }
                    });
        },
        startPay:function(){
            var _this=this;
             this.$axios({
                        method: "post",                       
                        url: _this.$store.state.recycleAddr + "/recOrder/startPay",
                        data: _this.form
                    }).then((res) => {
                        if (res.data.status === 200) {  
                            _this.show=false; 
                             _this.$emit('after-save');                                                                    
                        }
                    });
        },
        cancelPayment:function(){

        },
       
        
    },
    props: ["tradeType", "productTitle","id","unit"]
};
</script>
