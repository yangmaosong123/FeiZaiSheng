<template>
<div class="issue-commodity-dialog">

    <el-dialog ref="dialog" @close="close" title="商品发布" :visible.sync="show" :close-on-click-modal="false" width="50%">
        <!-- 表单 -->
        <el-form :model="ruleForm" :rules="rules" ref="formObj" label-width="130px" class="demo-ruleForm" style="position:relative;">
            <el-form-item label="交易标题" prop="productTitle">
                <el-input v-model="ruleForm.productTitle" :maxlength="200" placeholder="请输入交易标题" style="width:194px;"></el-input>
            </el-form-item>
            <el-form-item label="交易类别" prop="tradeType">
                <el-radio-group v-model="ruleForm.tradeType">
                    <el-radio label="sell">出售</el-radio>
                    <el-radio label="buy">求购</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="行业来源" prop="source">
                <el-select v-model="ruleForm.source" placeholder="请选择行业来源" @change="handleSourceChange">
                    <el-option v-for="item in $store.state.dictionary.hsly" :key="item.id" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="种类" prop="category">
                <el-select v-model="ruleForm.category" @change="handleCategoryChange" placeholder="请选择种类">
                    <el-option v-for="item in categorys" :key="item.id" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类别" prop="subCategory">
                <el-select v-model="ruleForm.subCategory" placeholder="请选择类别">
                    <el-option v-for="item in subCategorys" :key="item.id" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格方式" prop="offerType" class="whetherPricing">
                <el-radio-group v-model="ruleForm.offerType">
                    <el-radio label="1">面议</el-radio>
                    <el-radio label="2">公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
                <el-input v-model="ruleForm.quantity" maxlength="10" placeholder="请输入数量" style="width:194px; margin-bottom:16px;"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
                <el-select v-model="ruleForm.unit" placeholder="请选择一个单位">
                    <el-option v-for="item in $store.state.dictionary.unit" :key="item.id" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.offerType==2" label="单价" prop="price">
                <el-input v-model="ruleForm.price" maxlength="10" placeholder="请输入单价" style="width:194px; margin-top:16px;"></el-input>
            </el-form-item>
            <el-form-item label="最少交易量" prop="minTradeQuantity">
                <el-input maxlength="10" v-model="ruleForm.minTradeQuantity" style="width:30%;" placeholder="请输入最少交易量"></el-input>
            </el-form-item>
            <el-form-item label="发布时效" prop="deadline" @focus="init">
                <el-select v-model="ruleForm.deadline" placeholder="请选择发布时效">
                    <el-option v-for="item in $store.state.dictionary.cxsj" :key="item.id" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物流承运" prop="logisticsIncluded" class="whetherPricing">
                <el-radio-group v-model="ruleForm.logisticsIncluded">
                    <el-radio label="Y">是</el-radio>
                    <el-radio label="N">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="物流公司" prop="logisticsCompany" v-show="ruleForm.logisticsIncluded=='Y'">
                <el-select v-model="ruleForm.logisticsCompany" placeholder="请选择物流公司">
                    <el-option v-for="item in $store.state.dictionary.REC_LOGISTICS_COMPANY" :key="item.itemCode" :label="item.title" :value="item.itemCode">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="上传图片" class="upload-photos" prop="fileId">
                <img-upload :fileId="ruleForm.fileId" @after-change="handleProdImgChange" />
            </el-form-item>
            <el-form-item label="交易介绍" prop="remark">
                <el-input type="textarea" :maxlength="1000" style="width:90%;" v-model="ruleForm.remark" placeholder="请输入交易介绍"></el-input>
            </el-form-item>
            <el-form-item label="交易图片" class="upload-photos" prop="buinessImgId">
                <img-upload :fileId="ruleForm.buinessImgId" @after-change="handlebuinessImgChange" />

            </el-form-item>

            <el-form-item label="联系地址" prop="addrId">
                <!-- 联系地址组件 -->
                <ContactAddress @def-change="defAddrSelect" @change="addrSelect" :defId="ruleForm.addrId"></ContactAddress>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">                        
            <el-button type="primary" :disabled="disabled" @click="handleIssueCommodity('ruleForm')">发布商品</el-button>
            <el-button :disabled="disabledDraftBtn" @click="handleSaveDraft('ruleForm')">暂 存</el-button>
            <el-button @click="close">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import ContactAddress from './ContactAddress'
import ImgUpload from './ImgUpload2'

export default {
    name: "issueCommodity", //商品发布
    data() {

        //验证价格
        let handleJudgeIsNumber = (rule, value, callback) => {
            if(!value){
                return callback();
            }
            if (isNaN(value))
                return callback(new Error('数量/价格必须为数字，请返回修改！'));
            else if (value < 0 || value == 0) return callback(new Error('数量/价格">=1"'));
            else return callback();
        };

        //验证最少交易量
        let handleJudgeIsMinNumber = (rule, value, callback) => {
             if(!value){
                return callback();
            }
            if (isNaN(value))
                return callback(new Error('最少交易量必须为数字，请返回修改！'));
            else if (value < 0 || value == 0) return callback(new Error('最交交易量必须">=1"'));
                 
            else if (parseInt(this.ruleForm.minTradeQuantity) > parseInt(this.ruleForm.quantity)) return callback(new Error('最少交易量必须小于数量'));
            else return callback();
        };

        //验证上传图片
        let handleVerifyIntroductionPhone = (rule, value, callback) => {

            if (!this.ruleForm.fileId.length) {
                callback(new Error('请上传图片'));
            } else callback();
        };

        //验证交易图片
        let handleVerifyDealPhone = (rule, value, callback) => {

            if (this.ruleForm.buinessImgId.length == 0) {
                callback(new Error('请上传交易图片'));
            } else callback();
        };

        let logisticsCompanyCheck = (rule, value, callback) => {
            //物流承运为是的时候，则需要选择物流公司
            if (this.ruleForm.logisticsIncluded == 'Y' && this.ruleForm.logisticsCompany == '') {
                callback(new Error('请选择物流公司'));
            } else callback();
        };

        let addrIdCheck = (rule, value, callback) => {
            if (this.ruleForm.addrId=="") {
                callback(new Error('请选择物流公司'));
            } else callback();
        };


        return {
            show: true, //发布商品
            sources: [], //行业来源
            categorys: [], //种类
            subCategorys: [], //单位
            deadlines: [], //发布时效
            units: [], //类别
            
            ruleForm: {
                addrId: '', //联系人id
                source: "",
                category: "",
                subCategory: "",                
                buinessImgId: "", //交易图片ids                
                introductionPhotos: "", //上传图片
                introductionPhones: "", //交易图片
                logisticsCompany: "", //物流企业编码
                id: "",
                productTitle: "",
                price:"",
                minTradeQuantity:"",
                quantity:"",
                fileId:"",
            }, //发布商品表单--数据
            //发布时的必填校验规则
            rules: {
                productTitle: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }],
                tradeType: [{
                    required: true,
                    message: '请选择交易类别',
                    trigger: 'blur'
                }],
                subCategory: [{
                    required: true,
                    message: '请选择类别',
                    trigger: 'blur'
                }],
                source: [{
                    required: true,
                    message: '请选择行业来源',
                    trigger: 'blur'
                }],
                category: [{
                    required: true,
                    message: '请选择种类',
                    trigger: 'blur'
                }],
                offerType: [{
                    required: true,
                    message: '请选择价格方式',
                    trigger: 'blur'
                }],
                minTradeQuantity: [{
                        required: true,
                        message: '请输入最少交易量',
                        trigger: 'blur'
                    },
                    {
                        validator: handleJudgeIsMinNumber,
                        trigger: 'blur'
                    }
                ],
                quantity: [{
                        required: true,
                        message: '请输入数量',
                        trigger: 'blur'
                    },
                    {
                        validator: handleJudgeIsNumber,
                        trigger: 'blur'
                    }
                ],
                unit: [{
                    required: true,
                    message: '请选择一个单位',
                    trigger: 'blur'
                }],
                price: [{
                        required: true,
                        message: '请输入单价',
                        trigger: 'blur'
                    },
                    {
                        validator: handleJudgeIsNumber,
                        trigger: 'blur'
                    }
                ],
                deadline: [{
                    required: true,
                    message: '请选择发布时效',
                    trigger: 'blur'
                }],
                logisticsIncluded: [{
                    required: true,
                    message: '请选择物流承运方式',
                    trigger: 'blur'
                }],
                logisticsCompany: [{
                    validator: logisticsCompanyCheck,
                    trigger: 'blur'
                }],
                fileId: [{
                    validator: handleVerifyIntroductionPhone,
                    trigger: 'blur'
                }],
                remark: [{
                    required: true,
                    message: '请输入交易介绍',
                    trigger: 'blur'
                }],
                buinessImgId: [{
                        required: true,
                        message: "交易图片必填",
                        trigger: 'blur'
                    },
                    {
                        validator: handleVerifyDealPhone,
                        trigger: 'blur'
                    }
                ],
                fileId: [{
                        required: true,
                        message: "图片必填",
                        trigger: 'blur'
                    },
                    {
                        validator: handleVerifyIntroductionPhone,
                    }
                ],

                addrId:[
                    {
                        validator: addrIdCheck,
                    }
                ],
            },
            //暂存时的必填校验规则
            draftRules: {
                //标题必填
                  productTitle: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }],
                //如果有输入最小成交量的话，则必须为合法的整数
                minTradeQuantity: [{
                    validator: handleJudgeIsMinNumber,
                    trigger: 'blur'
                }],
                 //如果有输入发布数量的，则必须为合法的整数
                quantity: [{
                    validator: handleJudgeIsNumber,
                    trigger: 'blur'
                }],

                price: [{
                    validator: handleJudgeIsNumber,
                    trigger: 'blur'
                }],
            },
            disabled: false, //控制按钮禁用
            disabledDraftBtn: false, //控制暂存按钮
        };
    },
    components: {
        ContactAddress, //联系地址
        "img-upload": ImgUpload
    },
    props: ["rowId","showFlag"],
    watch: {
        "showFlag":function(){
            this.show=this.showFlag;
        },
        'ruleForm.logisticsIncluded': function () {
            if (this.ruleForm.logisticsIncluded == 'N') {
                this.ruleForm.logisticsCompany = "";
            }
        },
        'rowId': function () {
            if (this.rowId != null) {
                this.loadData();
            }
        },

    },
    
    created: function () {
        this.init(); //获取行业来源

        //判断是否为修改时显示，如果是的话，则需要把要修改的数据从后台取出来
        if (this.rowId != null) {
            this.loadData();
        }

    },
    methods: {
        handleProdImgChange(id) {
            this.ruleForm.fileId = id;
        },
        handlebuinessImgChange(id) {
            this.ruleForm.buinessImgId = id;
        },
        //调用加载图片的接口（因为有2类图片需要从后台取，所以写成了公用的方法）
        loadImgId(bizObjId, bizObjName, callback) {
            let _this = this;
            _this.$axios({
                method: "post",
                url: "/attachment/findByBizObj",
                data: {
                    bizObjId: bizObjId,
                    bizObjName: bizObjName,
                }
            }).then(res => {
                if (res.data.status === 200 && res.data.data.length > 0) {
                    //图片记录id连接成一个字符串
                    var sz = [];
                    for (var i = 0; i < res.data.data.length; i++) {
                        sz.push(res.data.data[i].id);
                    }
                    callback(sz.join(","));
                }
            })
        },
        //加载被修改的数据
        loadData() {
            let _this = this;
            _this.$axios({
                method: "post",
                url: _this.$store.state.recycleAddr + "/recProduct/load",
                data: {
                    id: _this.rowId
                }
            }).then(res => {
                if (res.data.status === 200) {
                    _this.ruleForm = res.data.data;
                    if (!!_this.ruleForm.source) {
                        _this.loadCategoryDataList();
                    }
                    //取上传图片的记录id
                    _this.loadImgId(_this.ruleForm.id, "upload_img", function (id) {                        
                        _this.$set(_this.ruleForm,"fileId",id);
                    });
                    //取交易图片的记录id
                    _this.loadImgId(_this.ruleForm.id, "buiness_img", function (id) {
                        _this.$set(_this.ruleForm,"buinessImgId",id);
                        
                    });
                }
            })
        },
        //3级联动不用这种方法，用我们之前的方法
        handleSourceChange() {
            this.ruleForm.category = "";
            this.ruleForm.subCategory = "";
            this.categorys = [];
            this.subCategorys = [];
            this.loadCategoryDataList();
        },
        handleCategoryChange() {
            this.ruleForm.subCategory = "";
            this.subCategorys = [];
            this.loadSubcategoryDataList();
        },

        loadCategoryDataList() {
            var _this = this;
            this.loadChildren(this.findConfigItem(this.ruleForm.source, this.$store.state.dictionary.hsly).id, function (data) {
                _this.categorys = data;
                _this.subCategorys = [];
                if (!!_this.ruleForm.category) {
                    _this.loadSubcategoryDataList();
                }

            });
        },

        loadSubcategoryDataList() {
            if (this.categorys.length == 0) {
                return;
            }
            var _this = this;
            this.loadChildren(this.findConfigItem(this.ruleForm.category, this.categorys).id, function (data) {
                _this.subCategorys = data;
            });
        },

        //显示发布商品弹框
        ShowIssueCommodityDialog() {
            let _this = this;
            _this.issueCommodityDialogTableVisible = true;

        },

        //转换成element-select数据格式
        handleChangeElement(obj) {
            if (obj == null) {
                return [];
            }
            let result = [];
            for (let i = 0; i < obj.length; i++) {
                result.push({});
                result[i].value = obj[i].id;
                result[i].label = obj[i].title
            }
            return result;
        },

        //转换成element-select数据格式
        handleChangeElement1(obj) {
            let result = [];
            for (let i = 0; i < obj.length; i++) {
                result.push({});
                result[i].value = obj[i].itemCode;
                result[i].label = obj[i].title
            }
            return result;
        },

        //加载路由词典
        init() {
            let _this = this;
            _this.$axios({
                method: "post",
                url: "/base/findDictionary",
                data: {
                    moduleCode: "hsly,cxsj,unit"
                }
            }).then(res => {
                console.log(res.data.data.hsly);
                _this.sources = _this.handleChangeElement(res.data.data.hsly); //行业来源
                _this.units = _this.handleChangeElement1(res.data.data.unit); //单位
                _this.deadlines = _this.handleChangeElement1(res.data.data.cxsj); //发布时效
            });
        },

        //监听行业来源数据变化
        loadChildren(parentId, callback) {
            let _this = this;
            _this.$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                    id: parentId
                }
            }).then(res => {
                if (res.data.status === 200) {
                    callback(res.data.data);
                }
            });
        },

        //获取子组件传递过来的数据
        addrSelect(value) {            
            this.ruleForm.addrId = value;
        },
        defAddrSelect(value){
           if(this.ruleForm.addrId==""){
               this.ruleForm.addrId = value;
           }
        },

        //上传文件格式限制
        beforeAvatarUpload(file) {
            let _this = this;
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                _this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                _this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        //上传图片
        handleBeforeRemove(file, fileList) {
            //_this.ruleForm.newFileId = _this.ruleForm.fileId.filter(item => item !== file.response.data);
            //console.log('您取消的图片返回结果为：', _this.ruleForm.newFileId);
            var index = this.ruleForm.introductionPhotos.indexOf(file.uid);
            this.ruleForm.fileId.splice(index, 1);
            this.ruleForm.introductionPhotos.splice(index, 1);
        },
        handleCompanyUpload(content, file) {
            this.ruleForm.introductionPhotos.push(file.uid);
            this.ruleForm.fileId.push(content.data);
        },

        //交易图片
        //取消某一张图片上传
        handleBeforeRemoveDeal(file, fileList) {
            let _this = this;
            console.log('您取消的图片id为：', file.response.data);
            _this.ruleForm.newBuinessImgId = _this.ruleForm.buinessImgId.filter(item => item !== file.response.data);
            console.log('您取消的图片返回结果为：', _this.ruleForm.newBuinessImgId);
        },

        //危废图片--支持多选
        handleCompanyUploadDeal(content) {
            console.log("返回成功：", content);
            var obj = {
                name: '',
                url: this.$store.state.outputImgByIdUrl + content.data
            };
            this.ruleForm.introductionPhones.push(obj);
            this.ruleForm.buinessImgId.push(content.data);
        },
        //暂存方法
        handleSaveDraft(ruleForm) {
            var _this = this;
            //设置校验规则为草稿的规则
             this.$refs["formObj"].rules = this.draftRules;

            this.$refs["formObj"].validate((valid) => {
                if (valid == false) {
                     _this.$message({
                                type: 'warning',
                                message: "操作不能继续，有必填字段需要填写！"
                            });
                    return;
                }

                //_this.disabledDraftBtn = true;
                _this.$axios({
                    method: "post",
                    url: _this.$store.state.recycleAddr + "/recProduct/draft",
                    data: {
                        id: _this.ruleForm.id,
                        addrId: _this.ruleForm.addrId,
                        productTitle: _this.ruleForm.productTitle, //交易标题
                        tradeType: _this.ruleForm.tradeType, //交易类别
                        source: _this.ruleForm.source, //行业来源
                        category: _this.ruleForm.category, //种类
                        subCategory: _this.ruleForm.subCategory, //类别
                        offerType: _this.ruleForm.offerType, //价格方式
                        quantity: _this.ruleForm.quantity, //数量
                        unit: _this.ruleForm.unit, //单位
                        price: _this.ruleForm.price, //单价
                        minTradeQuantity: _this.ruleForm.minTradeQuantity, //最少交易量
                        deadline: _this.ruleForm.deadline, //发布时效
                        logisticsIncluded: _this.ruleForm.logisticsIncluded, //物流承运
                        fileId: _this.ruleForm.fileId, //上传图片
                        remark: _this.ruleForm.remark, //交易介绍
                        logisticsCompany: _this.ruleForm.logisticsCompany,
                        buinessImgId: _this.ruleForm.buinessImgId, //交易图片
                    }
                }).then(res => {
                    switch (res.data.status) {
                        case 200:
                            _this.$message({
                                type: 'success',
                                message: "商品暂存成功"
                            });
                            //_this.disabledDraftBtn = false;
                            _this.$emit("after-save");
                            break;
                    }
                })

            });

        },
        //发布商品
        handleIssueCommodity(ruleForm) {
            //设置为发布必填校验规则
            this.$refs["formObj"].rules = this.rules;
            let _this = this;
            _this.$refs["formObj"].validate((valid) => {
                if (valid) {
                    _this.disabled = true;
                    _this.$axios({
                        method: "post",
                        url: _this.$store.state.recycleAddr + "/recProduct/create",
                        data: {
                             id: _this.ruleForm.id,
                            addrId: _this.ruleForm.addrId,
                            productTitle: _this.ruleForm.productTitle, //交易标题
                            tradeType: _this.ruleForm.tradeType, //交易类别
                            source: _this.ruleForm.source, //行业来源
                            category: _this.ruleForm.category, //种类
                            subCategory: _this.ruleForm.subCategory, //类别
                            offerType: _this.ruleForm.offerType, //价格方式
                            quantity: _this.ruleForm.quantity, //数量
                            unit: _this.ruleForm.unit, //单位
                            price:  _this.ruleForm.price, //单价
                            minTradeQuantity: _this.ruleForm.minTradeQuantity, //最少交易量
                            deadline: _this.ruleForm.deadline, //发布时效
                            logisticsIncluded: _this.ruleForm.logisticsIncluded, //物流承运
                            fileId: _this.ruleForm.fileId, //上传图片
                            remark: _this.ruleForm.remark, //交易介绍
                            logisticsCompany: _this.ruleForm.logisticsCompany,
                            buinessImgId: _this.ruleForm.buinessImgId, //交易图片
                        }
                    }).then(res => {
                        switch (res.data.status) {
                            case 200:
                                //保存成功后，关闭dialog
                                _this.$refs.dialog.close();
                                _this.$message({
                                    type: 'success',
                                    message: "商品发布成功"
                                });
                                _this.issueCommodityDialogTableVisible = false;
                                _this.disabled = false;
                                _this.$emit("after-save");
                                break;
                            case -500:
                                _this.disabled = false;
                                break;
                        }
                    }).catch((err) => {
                        _this.$message({
                            type: 'warning',
                            message: "ajax错误！"
                        });
                        _this.disabled = false;
                    });
                } else {
                    _this.$message({
                                type: 'warning',
                                message: "操作不能继续，有必填字段需要填写！"
                            });
                    _this.disabled = false;
                    return false;
                }
            });
        },
        close: function () {
            this.ruleForm.productTitle = "";
            this.ruleForm.tradeType = "";
            this.ruleForm.source = "";
            this.ruleForm.category = "";
            this.ruleForm.subCategory = "";
            this.ruleForm.offerType = "";
            this.ruleForm.quantity = "";
            this.ruleForm.unit = "";
            this.ruleForm.price = "";
            this.ruleForm.remark = "";
            this.ruleForm.minTradeQuantity = "";
            this.ruleForm.deadline = "";
            this.ruleForm.fileId = "";
            this.ruleForm.buinessImgId = "";
            this.ruleForm.logisticsIncluded = "";
            this.ruleForm.introductionPhotos = [];
            this.ruleForm.introductionPhones = [];
            this.ruleForm.logisticsCompany = "";
            this.$emit("after-close");
        },
        //取消发布商品
        handleResetForm(ruleForm) {
            let _this = this;
            _this.issueCommodityDialogTableVisible = false;
            _this.$refs[ruleForm].resetFields();
        },

    }
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.el-textarea__inner{
 height: 100px;
}
</style>


