<template>
<!-- 确认交易 -->
<el-dialog title="请确认交易信息" width="30%" :visible.sync="show">
    <el-form :model="form" ref="form" class="demo-ruleForm" label-width="100px" :rules="formRules">
        <el-form-item label="交易标题：">
            <h3>
                【{{tradeType=='buy'?'求购':'出售'}}】 {{productTitle}}
            </h3>
        </el-form-item>
        <el-form-item label="交易数量：" prop="tradeQuantity">
                <el-row>
                    <el-col :span="18"><el-input v-model.number="form.tradeQuantity" style=" width: 90%;"></el-input></el-col>
                    <el-col :span="6">{{unit}}</el-col>
                </el-row>            
        </el-form-item>
        <el-form-item label="交易单价：" prop="tradePrice">
            <el-input v-model.number="form.tradePrice" style=" width: 67%;"></el-input>
        </el-form-item>
        <el-form-item label="交易总额：">
            <span>￥{{totalCount}}</span>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" :disabled="tradeConfirmationBtn" @click="submitData">确 定
        </el-button>
    </div>
</el-dialog>
</template>

<script>
export default {
    name: "confirmTrade",
    data() {
        //验证数量+价格
        let checkQuantity = (rule, value, callback) => {
            var reg= /^(([0-9]{1,})|([0-9]{1,}\.[0-9]{1,2}))*$/;
            if(reg.test(""+value)==false){
                return callback(new Error('数量必须是数字'));
            }                        
            return callback();
        };

        //验证价格
        let checkPrice = (rule, value, callback) => {
            var reg= /^(([0-9]{1,})|([0-9]{1,}\.[0-9]{1,2}))*$/;
            if(reg.test(""+value)==false){
                return callback(new Error('价格必须是数字'));
            }  
            return callback();
        };

        return {
            form: {
                tradeQuantity: "",
                tradePrice: "",
                id:0,
            },
            show:true,
            tradeConfirmationBtn: true, 
            totalCount:"",
            formRules: {
                tradeQuantity: [{
                        required: true,
                        message: '请输入交易数量',
                        trigger: 'blur'
                    },
                    {
                        validator: checkQuantity,
                        trigger: 'blur'
                    }
                ],
                tradePrice: [{
                        required: true,
                        message: '请输入交易单价',
                        trigger: 'blur'
                    },
                    {
                        validator: checkPrice,
                        trigger: 'blur'
                    }
                ],
            },

        };
    },
     watch:{
        "show":function(){            
            if(this.show==false){
                 this.form= {
                quantity: "",
                tradePrice: "",
                id:0,
                };
                this.$emit('hide');
            }
        },
        'form.tradeQuantity':function(){
            this.calAmt();
        },
        'form.tradePrice':function(){
            this.calAmt();
        },
    },

    computed: {
        totalCount: function () {
           
        },
    },
    created() {        
        this.form.tradeQuantity=parseFloat(this.tradeQuantity);
    },

    methods: {
        calAmt:function(){
            this.tradeConfirmationBtn = true;
            if (typeof this.form.tradeQuantity != "number" || typeof this.form.tradePrice != "number") {
                this.totalCount="";
                return;
            }
            this.tradeConfirmationBtn = false;
            this.totalCount= (this.form.tradeQuantity * this.form.tradePrice).toFixed(2);
        },
        hide:function(){
            this.show=false;           
        },

        submitData: function () {
            this.form.id=this.id;
            let _this = this;
            _this.$refs["form"].validate((valid) => {
                if (valid) {       
                    _this.$axios({
                        method: "post",                       
                        url: _this.$store.state.recycleAddr + "/recOrder/confirm",
                        data: _this.form
                    }).then((res) => {
                        if (res.data.status === 200) {                                                 
                            _this.$message({
                                type: 'success',
                                message: '确定交易成功！'
                            });
                            _this.$emit('after-save');
                        }
                    });                    
                } else {                  
                    return false;
                }
            });
        },
    },
    props: ["tradeType", "productTitle","id","minQuantity","unit","tradeQuantity"]
};
</script>
