/**
*@file 地址信息
*@author 周毖强
*/
<template>
  <div class="address-message">
    <!-- 公共标题 -->
    <CommonTitle title="地址信息"></CommonTitle>
    <div class="address-button">
      <el-button style="background:#208dd6;color:#fff;"
                 @click="handleShowAddAddressDialog">
        新增收货地址
      </el-button>
    </div>

    <!--表格-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="contacts"
        label="收货人"
        width="120">
      </el-table-column>
      <el-table-column
        label="地址信息"
        width="250">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName+scope.row.cityName+scope.row.regionName+" "+scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机"
        width="130">
      </el-table-column>
      <el-table-column
        prop="fixedLine"
        label="固定电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="170">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="handleShowEditDialog(scope.row)">编辑</el-button> -->
          <!--<el-button type="text" size="small" @click="handleDeleteAddressInfo(scope.row.id)">删除</el-button>-->
          <el-button v-show="scope.row.isDefault==1" type="text" size="small" style="color:#ff4001;"
                     @click="handleSaveSet(scope.row.id)">默认地址
          </el-button>
          <el-button type="text" size="small" style="color:rgb(0, 124, 198);"
                     v-show="scope.row.isDefault==0"
                     @click="handleSaveSet(scope.row.id)">设为默认地址
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

    <!-- 新增地址弹框 -->
    <el-dialog title="新增地址"
               width="50%"
               :close-on-click-modal="false"
               :visible.sync="addAddressDialogFormVisible">
      <el-form :model="addAddressForm"
               :rules="addAddressFormRules"
               ref="addAddressForm"
               label-width="100px">
        <el-form-item label="收货人:" prop="contacts">
          <el-input v-model="addAddressForm.contacts"
                    placeholder="请选择活动区域"></el-input>
        </el-form-item>
        <el-form-item label="地址信息:" required>
          <el-col :span="6">
            <el-form-item prop="province">
              <el-select v-model="addAddressForm.province"
                         placeholder="请选择一个省份"
                         @focus="handleGetWasteProvince"
                         @change="handleChoseProvince">
                <el-option
                  v-for="item in addAddressForm.wasteProvinces"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="city">
              <el-select v-model="addAddressForm.city"
                         placeholder="请选择一个市"
                         @change="handleChoseCity">
                <el-option
                  v-for="item in addAddressForm.wasteCites"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="region">
              <el-select v-model="addAddressForm.region"
                         placeholder="请选择一个区"
                         @change="handleChoseBlock">
                <el-option
                  v-for="item in addAddressForm.wasteRegions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="address">
              <el-input v-model="addAddressForm.address"
                        placeholder="请输入详细地址信息"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式:" required>
          <el-col :span="11">
            <el-form-item prop="phone">
              <el-input v-model="addAddressForm.phone "
                        placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">或</el-col>
          <el-col :span="11">
            <el-form-item prop="fixedLine">
              <el-input v-model="addAddressForm.fixedLine"
                        placeholder="请输入座机号码(0755-8888888)"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addAddressForm.email "
                    placeholder="请输入邮箱信息"></el-input>
        </el-form-item>
        <el-form-item label="地址标签:" prop="addressLabel">
          <el-input v-model="addAddressForm.addressLabel "
                    placeholder="请输入地址标签"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="controlBtn" type="primary" @click="handleSubmitForm('addAddressForm')">立即创建</el-button>
        <el-button @click="resetForm('addAddressForm')">重置</el-button>
      </div>
    </el-dialog>

    <!-- 编辑地址弹框 -->
    <el-dialog title="编辑地址"
               width="40%"
               :close-on-click-modal="false"
               v-if="editAddressDialogFormVisible"
               :visible.sync="editAddressDialogFormVisible">
      <el-form :model="editAddressForm"
               :rules="editAddressFormRules"
               ref="editAddressForm"
               label-width="100px">
        <el-form-item label="收货人:" prop="contacts">
          <el-input v-model="editAddressForm.contacts"
                    placeholder="请选择活动区域"></el-input>
        </el-form-item>
        <el-form-item label="地址信息:" required>
          <el-col :span="6">
            <el-form-item prop="wasteProvinceValue">
              <el-select v-model="editAddressForm.province"
                         placeholder="请选择一个省份"
                         @focus="handleGetEditProvinceData"
                         @change="handleChoseEditProvince">
                <el-option
                  v-for="item in editAddressForm.wasteProvinces"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="wasteCityValue">
              <el-select v-model="editAddressForm.city"
                         placeholder="请选择一个市"
                         @change="handleChoseEditCity">
                <el-option
                  v-for="item in editAddressForm.wasteCites"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="wasteRegionsValue">
              <el-select v-model="editAddressForm.region"
                         placeholder="请选择一个区"
                         @change="handleChoseEditBlock">
                <el-option
                  v-for="item in editAddressForm.wasteRegions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="detailedAddress">
              <el-input v-model="editAddressForm.address"
                        placeholder="请输入详细地址信息"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式:" required>
          <el-col :span="11">
            <el-form-item prop="phone">
              <el-input v-model="editAddressForm.phone "
                        placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center;">或</el-col>
          <el-col :span="11">
            <el-form-item prop="fixedLine">
              <el-input v-model="editAddressForm.fixedLine"
                        placeholder="请输入11位座机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editAddressForm.email "
                    placeholder="请输入邮箱信息"></el-input>
        </el-form-item>
        <el-form-item label="地址标签:" prop="addressLabel">
          <el-input v-model="editAddressForm.addressLabel "
                    placeholder="请输入地址标签"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSubmitForm('addAddressForm')">保存编辑</el-button>
        <el-button @click="editAddressDialogFormVisible=false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle';

  export default {
    name: "addressMessage",//地址信息
    data() {

      //校验手机号码
      let handleVerifyPhone = (rule, value, callback) => {
        if (!/^1[34578]\d{9}$/.test(value)) {
          return callback(new Error("用户手机格式不正确，请返回修改！"));
        } else callback();
      };

      //校验座机号码
      let handleVerifySpecial = (rule, value, callback) => {
        if (!/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)) {
          callback(new Error('(0123-1234567 或 012-12345678)'));
        } else callback();
      };

      // 校验邮箱
      let handleVerifyEmail = (rule, value, callback) => {
        let reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
        if (!reg.test(value))
          return callback(new Error("用户邮箱格式为[example@example.com]，请返回修改！"));
        else callback();
      };

      return {
        //表数据
        tableData: [],
        //分页
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//面条数
        },
        //新增地址弹框数据
        addAddressDialogFormVisible: false,
        controlBtn: false,//防止用户多次点击
        addAddressForm: {
          wasteProvinceValue: '',//危废区域--省份值
          wasteProvinces: [],//危废区域--省份
          wasteCityValue: '',//危废区域--市值
          wasteCites: [],//危废区域--市
          wasteRegionsValue: '',//危废区域--区值
          wasteRegions: [],//危废区域--区
          detailedAddress: "",//详细地址
        },
        addAddressFormRules: {
          contacts: [
            {required: true, message: '请输入收货人信息', trigger: 'blur'},
          ],
          province: [
            {required: true, message: '请选择一个省份', trigger: 'blur'},
          ],
          city: [
            {required: true, message: '请选择一个市', trigger: 'blur'},
          ],
          region: [
            {required: true, message: '请选择一个区', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请输入详细地址信息', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: handleVerifyPhone, trigger: 'blur'}
          ],
          fixedLine: [
            {required: true, message: '请输入11位座机号码', trigger: 'blur'},
            {validator: handleVerifySpecial, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱信息', trigger: 'blur'},
            {validator: handleVerifyEmail, trigger: 'blur'}
          ],
          addressLabel: [
            {required: true, message: '请输入地址标签', trigger: 'blur'},
          ],
        },

        //编辑地址弹框数据
        editAddressDialogFormVisible: false,
        editAddressForm: {
          id: "",//id
          province: '',//危废区域--省份值
          provinceValue: '',//危废区域--省份值
          wasteProvinces: [],//危废区域--省份
          city: '',//危废区域--市值
          cityValue: '',//危废区域--市值
          wasteCites: [],//危废区域--市
          region: '',//危废区域--区值
          regionValue: '',//危废区域--区值
          wasteRegions: [],//危废区域--区
          address: "",//详细地址
        },
        editAddressFormRules: {
          contacts: [
            {required: true, message: '请输入收货人信息', trigger: 'blur'},
          ],
          province: [
            {required: true, message: '请选择一个省份', trigger: 'blur'},
          ],
          city: [
            {required: true, message: '请选择一个市', trigger: 'blur'},
          ],
          region: [
            {required: true, message: '请选择一个区', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请输入详细地址信息', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: handleVerifyPhone, trigger: 'blur'}
          ],
          fixedLine: [
            {required: true, message: '请输入座机号', trigger: 'blur'},
            {validator: handleVerifySpecial, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱信息', trigger: 'blur'},
            {validator: handleVerifyEmail, trigger: 'blur'}
          ],
          addressLabel: [
            {required: true, message: '请输入地址标签', trigger: 'blur'},
          ]
        },
      };
    },
    components: {
      CommonTitle,//公共标题
    },
    created() {
      this.handleGetAddressData();//获取地址信息数据
    },
    methods: {

      //获取地址信息数据
      handleGetAddressData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/addressManage/list",
          data: {
            status: "1",
            pageIndex: _this.page.pageNum, //页数
            pageSize: _this.page.pageSize,//条数
          }
        }).then((res) => {
          switch (res.data.status) {
            case  -500:
              _this.tableData = [];
              break;
            case  200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case  300:
              _this.tableData = [];
              break;
          }
        })
      },

      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetAddressData();//获取地址信息数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.pageNum = val;
        this.handleGetAddressData();//获取地址信息数据
      },

      //显示地址信息弹框
      handleShowAddAddressDialog() {
        this.addAddressDialogFormVisible = true;
      },

      //省-市-区
      handleGetWasteProvince() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: "qy",
            parentId: 0
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            _this.addAddressForm.wasteProvinces = res.data.data;
          }
        })

      },

      // 选择市
      handleChoseProvince(e) {
        let _this = this;
        for (let i in _this.addAddressForm.wasteProvinces) {
          if (e === _this.addAddressForm.wasteProvinces[i].id) {
            _this.$axios({
              method: "post",
              url: "/base/getListByProvinceId",
              data: {
                id: _this.addAddressForm.wasteProvinces[i].id
              }
            })
              .then(function (res) {
                if (res.data.status === 200) {
                  _this.addAddressForm.wasteCites = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区
      handleChoseCity(e) {
        let _this = this;
        for (let i in _this.addAddressForm.wasteCites) {
          if (e === _this.addAddressForm.wasteCites[i].id) {
            _this
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: _this.addAddressForm.wasteCites[i].id
                }
              })
              .then(function (res) {
                if (res.data.status === 200) {
                  _this.addAddressForm.wasteRegions = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区县
      handleChoseBlock(e) {
        this.E = e;
        console.log(this.E);
      },

      //创建地址信息
      handleSubmitForm(addAddressForm) {
        let _this = this;
        _this.$refs[addAddressForm].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              _this.controlBtn = true;
              _this.$axios({
                method: "post",
                url: "/addressManage/create",
                data: {
                  contacts: _this.addAddressForm.contacts,//用户名
                  province: _this.addAddressForm.province,//省
                  city: _this.addAddressForm.city,//市
                  region: _this.addAddressForm.region,//区
                  address: _this.addAddressForm.address,//地址信息
                  phone: _this.addAddressForm.phone,//手机
                  fixedLine: _this.addAddressForm.fixedLine,//固话
                  email: _this.addAddressForm.email,//邮箱
                  isDefault: "0",//后端默认
                  addressLabel: _this.addAddressForm.addressLabel,//地址标签
                }
              }).then((res) => {
                switch (res.data.status) {
                  case  200:
                    _this.$message({
                      type: "success",
                      message: "地址信息创建成功！"
                    });
                    _this.addAddressDialogFormVisible = false;
                    _this.handleGetAddressData();//获取地址信息数据
                    _this.addAddressForm = {
                      wasteProvinceValue: '',//危废区域--省份值
                      wasteProvinces: [],//危废区域--省份
                      wasteCityValue: '',//危废区域--市值
                      wasteCites: [],//危废区域--市
                      wasteRegionsValue: '',//危废区域--区值
                      wasteRegions: [],//危废区域--区
                      detailedAddress: "",//详细地址
                    };
                    _this.controlBtn = false;
                    break;
                }
              })
            }, 1000);
          } else {
            _this.$message({
              type: "warning",
              message: "带红星的选项为必填项，请返回修改！"
            });
            return false;
          }
        });
      },

      //重置信息
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //当获取焦点时获取省市区数据
      handleGetEditProvinceData() {
        this.handleGetEditWasteProvince();
      },

      //通用方法
      handleCommonMethod(temp) {
        let tempMenus = [];
        for (let i = 0; i < temp.length; i++) {
          tempMenus.push({});
          let menuItem = tempMenus[i];
          menuItem.value = temp[i].id.toString();
          menuItem.label = temp[i].title;
        }
        return tempMenus;
      },

      //省-市-区
      handleGetEditWasteProvince() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: "qy",
            parentId: 0
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.editAddressForm.wasteProvinces = _this.handleCommonMethod(res.data.data);
            console.log("_this.editAddressForm.wasteProvinces", _this.editAddressForm.wasteProvinces);
          }
        })

      },

      // 选择市
      handleChoseEditProvince() {
        let _this = this;
        for (let i in _this.editAddressForm.wasteProvinces) {
          if (_this.editAddressForm.province === _this.editAddressForm.wasteProvinces[i].value) {
            _this.$axios({
              method: "post",
              url: "/base/getListByProvinceId",
              data: {
                id: _this.editAddressForm.province
              }
            })
              .then((res) => {
                if (res.data.status === 200) {
                  console.log("_this.editAddressForm.province", _this.editAddressForm.province);
                  _this.editAddressForm.wasteCites = _this.handleCommonMethod(res.data.data);
                  _this.editAddressForm.city = "";
                  _this.editAddressForm.region = "";
                  _this.editAddressForm.address = "";
                }
              });
          }
        }
      },

      // 选择对应的区
      handleChoseEditCity() {
        let _this = this;
        for (let i in _this.editAddressForm.wasteCites) {
          if (_this.editAddressForm.city === _this.editAddressForm.wasteCites[i].value) {
            _this
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: _this.editAddressForm.city
                }
              })
              .then((res) => {
                if (res.data.status === 200) {
                  console.log("_this.editAddressForm.city", _this.editAddressForm.city);
                  _this.editAddressForm.wasteRegions = _this.handleCommonMethod(res.data.data);
                  console.log("  _this.editAddressForm.wasteRegions", _this.editAddressForm.wasteRegions);
                }
              });
          }
        }
      },

      // 选择对应的区县
      handleChoseEditBlock(e) {
        this.E = e;
        console.log(this.E);
      },

      //显示编辑弹框
      handleShowEditDialog(row) {
        let _this = this;
        _this.editAddressDialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/addressManage/get",
          data: {
            id: row.id,//id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              let {id, contacts, provinceName, isDefault, province, cityName, city, regionName, region, address, phone, fixedLine, email, addressLabel} = res.data.data[0];
              _this.editAddressForm.id = id;
              _this.editAddressForm.contacts = contacts;
              _this.editAddressForm.province = provinceName;
              _this.editAddressForm.provinceValue = province;
              _this.editAddressForm.city = cityName;
              _this.editAddressForm.cityValue = city;
              _this.editAddressForm.region = regionName;
              _this.editAddressForm.regionValue = region;
              _this.editAddressForm.address = address;
              _this.editAddressForm.phone = phone;
              _this.editAddressForm.fixedLine = fixedLine;
              _this.editAddressForm.email = email;
              _this.editAddressForm.addressLabel = addressLabel;
              _this.editAddressForm.isDefault = isDefault;
              break;
          }
        });
      },


      //保存编辑
      handleEditSubmitForm() {
        let _this = this;
        if (!_this.editAddressForm.city ||
          !_this.editAddressForm.region ||
          !_this.editAddressForm.address) {
          _this.$message({
            type: 'warning',
            message: '地址信息必须填写完整，请返回修改'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/addressManage/update",
            data: {
              id: _this.editAddressForm.id,//id
              contacts: _this.editAddressForm.contacts,//用户名
              province: /^[\u3220-\uFA29]+$/.test(_this.editAddressForm.province) ? _this.editAddressForm.provinceValue : _this.editAddressForm.province,//省
              city: /^[\u3220-\uFA29]+$/.test(_this.editAddressForm.city) ? _this.editAddressForm.cityValue : _this.editAddressForm.city,//市
              region: /^[\u3220-\uFA29]+$/.test(_this.editAddressForm.region) ? _this.editAddressForm.regionValue : _this.editAddressForm.region,//区
              address: _this.editAddressForm.address,//地址信息
              phone: _this.editAddressForm.phone,//手机
              fixedLine: _this.editAddressForm.fixedLine,//固话
              email: _this.editAddressForm.email,//邮箱
              isDefault: _this.editAddressForm.isDefault,
              addressLabel: _this.editAddressForm.addressLabel,//地址标签
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                console.log(_this.editAddressForm.provinceValue);
                console.log(_this.editAddressForm.province);
                _this.$message({
                  type: "success",
                  message: "地址信息编辑成功！"
                });
                _this.editAddressDialogFormVisible = false;
                _this.handleGetAddressData();//获取地址信息数据
                break;
            }
          })
        }

      },

      //删除地址信息
      handleDeleteAddressInfo(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该条地址信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/addressManage/delete",
            data: {
              id: id//当前用户id
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: "success",
                  message: "该地址删除成功"
                });
                _this.handleGetAddressData();//获取地址信息数据
                break;
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //保存设置默认
      handleSaveSet(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/addressManage/isSetDefaultAddress",
          data: {
            id: id,//当前用户
            isDeault: "1",//后端默认
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.$message({
                type: "success",
                message: "该用户已被设置为默认地址"
              });
              _this.handleGetAddressData();//获取地址信息数据
              break;
          }
        })
      }

    }
  };
</script>
<style lang="less" scoped>
  .address-message {
    .address-button {
      background: #fff;
      padding: 5px;
      height: 50px;
      position: relative;
      button {
        position: absolute;
        right: 10px;
      }
    }
    .pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 40%;
    }
  }
</style>
