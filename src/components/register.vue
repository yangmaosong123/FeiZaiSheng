/** @file 注册
*@author 周毖强
*/
<template>
  <div class="register">
    <el-card class="box-card my-card">
      <div slot="header" class="clearfix">
        <b>会员注册</b>
      </div>
      <!-- 注册表单 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="企业账号：" prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入手机号/邮箱"></el-input>
        </el-form-item>
        <el-form-item label="企业类型：" prop="checkedId">
          <el-radio-group v-model="ruleForm.checkedId">
            <el-radio v-for="item in ruleForm.companyTypeList" :label="item.itemCode" :key="item.id">{{item.title}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号密码：" prop="password">
          <el-input type="password" v-model="ruleForm.password" maxlength="20" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="password1">
          <el-input type="password" maxlength="200" v-model="ruleForm.password1" placeholder="请再次确认用户密码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="企业名称：" prop="companyName">
          <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="ruleForm.certificate">
            <el-radio label="1">企业五证</el-radio>
            <el-radio label="2">三证合一</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="item-phone" label-width="40px">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-change="handleChangeBusiness"
            :on-success="handleAvatarSuccessBusiness">
            <img v-if="ruleForm.business"
                 style="width:120px;height:120px;"
                 :src="$store.state.outputImgByIdUrl+ruleForm.business"
                 class="avatar">
            <el-button slot="trigger"
                       size="small"
                       type="text"
                       v-else
                       class="avatar-uploader-icon">
              营业执照
              <span style="color:#F56C6C;">*</span>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class=" item-phone" label-width="10px">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-success="handleAvatarSuccessDecode">
            <img v-if="ruleForm.deCode"
                 :src="$store.state.outputImgByIdUrl+ruleForm.deCode"
                 class="avatar"
                 style="width:120px;height:120px;">
            <el-button slot="trigger" size="small" type="text"
                       v-else
                       class="avatar-uploader-icon">
              组织机构代码
              <span style="color:#F56C6C;">*</span>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="item-phone" label-width="10px">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-success="handleAvatarSuccessAdministration">
            <img v-if="ruleForm.administration"
                 :src="$store.state.outputImgByIdUrl+ruleForm.administration"
                 class="avatar"
                 style="width:120px;height:120px;">
            <el-button v-else slot="trigger"
                       size="small"
                       type="text"
                       class="avatar-uploader-icon">
              税务登记证
              <span style="color:#F56C6C;">*</span>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="item-phone"
                      v-if="ruleForm.certificate=='1'"
                      label-width="10px">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-success="handleAvatarSuccessOpenAccount">
            <img v-if="ruleForm.openAccount"
                 :src="$store.state.outputImgByIdUrl+ruleForm.openAccount"
                 class="avatar"
                 style="width:120px;height:120px;">
            <el-button v-else slot="trigger"
                       size="small"
                       type="text"
                       class="avatar-uploader-icon">开户许可证
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="item-phone"
                      v-if="ruleForm.certificate=='1'"
                      label-width="10px">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-success="handleAvatarSuccessEnterprise">
            <img v-if="ruleForm.enterprise"
                 :src="$store.state.outputImgByIdUrl+ruleForm.enterprise"
                 class="avatar"
                 style="width:120px;height:120px;">
            <el-button v-else
                       slot="trigger"
                       size="small"
                       type="text"
                       class="avatar-uploader-icon">企业认证授权书
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="" prop="haveRead">
          <el-checkbox v-model="ruleForm.haveRead">我已阅读并同意</el-checkbox>
          <span style="display:inline-block;margin-left:6px;">
            <a style="color:#F56C6C;cursor:pointer;" @click="handleShowDealDialog">《会员注册协议》</a>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="controlBtn" style="background:#208dd6;color:#fff;"
                     @click="handleSubmitForm('ruleForm')">立即注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 协议 -->
    <el-dialog
      title="用户注册协议"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeCloseUserAgreement"
      width="50%">
      <div class="content">

        <h2 style=" text-align: center;">废再生网用户注册协议书</h2>


        <p>
          欢迎您阅读废再生网“用户注册协议书”（以下简称为“协议书”），本协议阐述之条款和条件适用于您使用废再生网（所涉域名www.fzaisheng.com，及废再生现在或未来开设的手机客户端和无线载体等）所提供的全面网上服务，废再生网提供的服务包括但不限于现货销售、线上采购、金融协同服务等，（以下称“服务”）。
          本协议是您与废再生网所有者深圳市复美环境科技有限公司之间就废再生网服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意并继续”按钮后，本协议即构成对双方有约束力的法律文件。

        </p>

        <h4>一、接受条款</h4>
        <p>
          1、本站的各项在线服务的所有权和运作权归废再生网所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。
        </p>
        <p>
          2、用户点击同意本协议，即视为用户确认自己具有享受在线购买、销售及享受服务等相应的权利和行为能力，能够独立承担法律责任。
        </p>
        <p>
          3、废再生网保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。
        </p>


        <h4>二、本站服务</h4>

        <p>废再生网通过互联网依法为用户提供产品信息、交易等服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。</p>
        <h4>三、用户信息</h4>

        <p>
          1、用户应本着个人或企业诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法有效、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且废再生网保留终止用户使用废再生网各项服务的权利。</p>
        <p>
          2、用户在本站进行浏览或进行买卖等经营活动时，涉及用户个人及企业真实姓名/名称、通信地址、联系方式、营业执照等隐私信息的，本站将予以严格保密，除非得到用户授权或法律另有规定，本站不会向外界披露用户个人及企业隐私信息。</p>
        <p>
          3、用户注册成功后，将产生密码等账户信息，您可以根据本站提示修改您的密码。用户应谨慎合理的地保存、使用其密码。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站。否则，由于用户自身的疏忽而导致账号信息泄露等后果，由用户自行承担。</p>
        <p>4、用户同意，废再生网拥有通过邮件、短信、电话等形式，向在本站注册、下单的用户发送订单信息、促销活动、售后服务、客户服务等告知信息的权利。</p>
        <p>5、用户若将在本站注册获得的账户借给他人使用，则必须承担由此产生的全部责任，且实际使用人需承担连带责任。</p>
        <p>6、用户同意，废再生网有权合法合理地使用用户的注册信息、密码等信息，依法登陆进入用户的注册账户，进行证据保全，包括但不限于公证、见证等。</p>

        <h4>四、服务终止</h4>
        <p>
          1、用户同意，在废再生网没有向您收费的情况下，本网站可以全权决定处理以任何合法合理理由（包括但不限于废再生网认为您已经违反本协议的字面意义和精神，或您以不符合本协议的字面意义和精神的方式行事）终止您的“服务”密码、账户的使用。用户同意，废再生网在向您收费的情况下，废再生网基于合理的怀疑，可在经过电子邮件等形式通知的情况下实施上述终止服务的行为。用户同意和承认，废再生网根据本协议，可立即使您的账户无效，或注销您的账户以及账户内的所有相关资料和档案，或禁止您进一步进入该档案或“服务”。账户终止后，废再生网没有任何义务为您或第三方转发任何您未曾阅读或发送的信息，此外，废再生网不会就终止向您提供的“服务”而对您或任何第三方承担任何责任。
        </p>
        <p>
          2、用户有权要求废再生网注销您的账户，经过废再生网站审核同意的，将注销您的账户，届时，您与废再生网站的合同关系即终止。您的账户注销后，废再生网没有义务向您披露账户中的任何信息，也没有任何义务为您或第三方转发任何您未曾阅读或发送的信息。;确认核对联络和消费名单、为宣传推广目的；为解决争议、排除纠纷和执行本法律声明目的等。
        </p>
        <p>
          3、用户理解并同意，您与废再生网的合同关系终止后，废再生网有权继续依法保存您的资料；您在使用服务期间存在违法行为或违反本协议规则的行为的，废再生网可依据本协议向您主张权利。
        </p>
        <p>
          五、服务费用
        </p>
        <p>
          用户在废再生网站进行交易或索取有偿服务、废再生网站提供的其他服务而发生所有应纳税负，以及相关硬件、软件、通讯、网络服务及其他方面的费用均由您自行承担。废再生网对在某时期内对某项服务免费并不代表对该项目永久的免费。废再生网保留在无须发出书面通知的情况下，仅在网站公示的情况下，暂时或永久地更改或停止部分或全部“服务”的权利。
        </p>

        <h4>六、用户依法言行的义务</h4>
        <p>
          本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务：
        </p>
        <p>1、不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；</p>
        <p>2、从中国大陆向境外传输资料信息时必须符合中国有关法规；</p>
        <p>3、不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</p>
        <p>4、不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；</p>
        <p>5、不得传输或发表损害国家、社会公共利益和涉及国家安全的信息资料或言论；</p>
        <p>6、不得教唆他人从事本条款所禁止的行为；</p>
        <p>7、不得利用在本站注册的账户进行非法牟利经营活动。</p>
        <p>
          用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。本站保有删除站内各类不符合法律政策或不真实的信息内容而无须通知用户的权利。若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭用户账号等措施。用户须对自己在网上的言论和行为承担法律责任。</p>
        <h4>七、商品信息</h4>
        <p>
          本站上的货物价格、数量、是否有货等商品信息将根据市场行情及销售情况随时发生变动，本站不作特别通知。由于网站货物信息数量庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于网络及电脑终端兼容性等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形请您知悉并理解；废再生网欢迎纠错，并会视情况给予纠错者一定的奖励。
        </p>


        <h4>八、订单</h4>
        <p>
          1、在您下订单时，请您仔细确认货物货品名称、价格、数量、材质、规格、电话、收货人地址、开票信息等。若您提供的信息有误导致交易过程中产生利益损失的，则废再生网将不承担相应法律责任及连带责任。
        </p>
        <p>
          2、由于市场变化以及各种以合理商业努力难以控制的因素的影响，本站无法保证您提供的订单信息中您希望购买的商品都会有货，如您拟购买的商品，发生缺货，您有权取消订单。
        </p>


        <h4>九、责任限制及不承诺担保</h4>
        <p>
          除非另有明确的书面说明,本站及其所包含的或以其它方式通过本站提供给您的全部信息、资料、货物（包括软件）和服务，均是在“按现状”和“按现有”的基础上提供的。除非另有明确的书面说明，废再生网不对本站的运营及其包含在本网站上的信息、资料、货物（包括软件）和服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的除外）。如因不可抗力或其它本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，废再生网会合理地尽力协助处理善后事宜。
        </p>
        <h4>十、协议更新及用户关注义务</h4>
        <p>
          1、根据国家法律法规变化及网站运营需要，废再生网有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在本站上即生效，并代替原来的协议。用户可随时登陆查阅最新协议；用户有义务不时关注并阅读最新版的协议及网站公告。如用户不同意更新后的协议，可以且应立即停止接受废再生网依据本协议提供的服务；如用户继续使用本网站提供的服务的，即视为同意更新后的协议。废再生网建议您在使用本站之前阅读本协议及本站的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。
        </p>
        <p>2、任何经废再生网确认已经违反相关法律法规或本协议或废再生网使用规则某一项或多项规定的用户，废再生网有权决定是否给予暂停使用或终止使用的处理，且因此造成的一切后果由用户自行承担。</p>
        <p>3、客户与废再生网基于交易合作签署的其他书面协议与本协议不一致的，以双方书面签署的协议为准。</p>
        <h4>十一、与第三方网站的链接</h4>
        <p>
          提供与第三方网站的链接仅仅为了给用户带来方便。如果您使用这些链接，将离开废再生站点。废再生网没有审查过所有这些第三方站点，对任何这些站点及其内容或它们的保密政策不进行控制，也不负任何责任。因此，我们对这些网站上的任何信息、软件以及其它产品或材料，或者通过使用它们可能获得的任何结果不予认可，也不作任何表述。如果用户决定访问本站点链接的任何第三方站点，其风险完全由用户自己承担。
        </p>

        <h4>十二、不可抗力</h4>
        <p>
          由于自然灾害、罢工或骚乱、物质短缺或定量配给、暴动、战争行为、政府行为、通信网络、供电单位采取的限电或断电措施、供电单位的电力设施故障、通讯或其他设施故障或严重伤亡事故、黑客攻击、尚无有效防御措施的计算机病毒的发作及其他各方不能预见并且对其发生和后果不能防止并避免的不可抗力原因，致使本公司延迟或未能履约的，本网站不对用户承担任何责任。
        </p>
        <h4>十三、关于网络</h4>
        <p>
          由于自然灾害、罢工或骚乱、物质短缺或定量配给、暴动、战争行为、政府行为、通信网络、供电单位采取的限电或断电措施、供电单位的电力设施故障、通讯或其他设施故障或严重伤亡事故、黑客攻击、尚无有效防御措施的计算机病毒的发作及其他各方不能预见并且对其发生和后果不能防止并避免的不可抗力原因，致使本公司延迟或未能履约的，本公司不对用户承担任何责任。
        </p>
        <h4>十三、关于网络</h4>
        <p>
          用户明白由于因特网上通路的阻塞或造成访问速度下降，均是正常，不属于废再生网违约，若遇电信运营商或国家政策等原因造成的网络中断，废再生网不承担相应责任。
        </p>
        <h4>十四、关于版权</h4>
        <p>
          以任何方式使用废再生网提供的服务，包括但不限于基于废再生网搭建的企业网站、企业邮箱等服务，所涉及的版权解释权归废再生网所有。
        </p>
        <h4>十五、法律管辖及适用</h4>
        <p>
          本协议条款适用于中国法律并依照中国法律解释，不会造成任何法律的冲突。任何因有关使用本站而发生的诉讼均应提交有管辖权的人民法院。如果用户还有疑问，用户可以直接给我们客服中心留言。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleBeforeCloseUserAgreement">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    data() {

      // 校验用户名
      let changeUser = (rule, value, callback) => {
        let _this = this;
        let reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
        if (!/^1[34578]\d{9}$/.test(value) && !reg.test(value)) {
          return callback(new Error("用户账号为合法的手机号或者邮箱！请返回修改！"));
        } else {
          _this.$axios({
            method: "post",
            url: "/user/checkAccount",
            data: {
              account: value
            }
          }).then((res) => {
            if (res.data.status !== 200) {
              return callback(new Error("该用户账号已存在，请返回修改！"));
            } else callback();
          });
        }
      };
      let verifyPassword = (rule, value, callback) => {
        if (!/^\S+$/.test(value))
          return callback(new Error("密码不包含空字符串，请返回修改"));
        else
          callback();
      };

      //验证两次输入密码是否一致
      let verifyPasswords = (rule, value, callback) => {
        if (value !== this.ruleForm.password)
          return callback(new Error("两次密码输入不一致，请返回修改"));
        else
          callback();
      };

      // 校验手机号
      let changePhone = (rule, value, callback) => {
        if (!/^1[34578]\d{9}$/.test(value))
          return callback(new Error("用户手机格式不正确，请返回修改！"));
        else callback();
      };

      // 校验邮箱
      let changeEmail = (rule, value, callback) => {
        let reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.(?:com|cn|com.cn)))$/;
        if (!reg.test(value)) {
          return callback(new Error("用户邮箱格式为[example@example.com/cn/com.cn]，请返回修改！"));
        } else callback();
      };

      let changeCertificateAttId = (rule, value, callback) => {
        if (!value.length) {
          return callback(new Error("请选择经营证书"));
        } else callback();
      };

      let changeHaveRead = (rule, value, callback) => {
        if (!value)
          return callback(new Error("会员注册协议必选！"));
        else callback();
      };

      return {

        //表单数据
        ruleForm: {
          userName: "",//企业用户
          checkedId: "",//企业类型--值
          companyTypeList: [],//企业类型
          password: "",//用户密码
          password1: "",//确认密码
          phone: "",//用户电话
          email: "",//用户邮箱
          companyName: "", //企业名称
          imageUrl: "",
          business: "",//营业执照
          deCode: "",//组织机构代码
          administration: "",//税务登记证
          openAccount: "",//开户许可证
          enterprise: "",//企业认证授权书
          certificateAttId: [],//经营证书
          certificate: "1",//证书类型
          haveRead: false,//是否阅读
        },

        rules: {
          userName: [
            {required: true, message: '请输入企业账号', trigger: 'blur'},
            {validator: changeUser, trigger: 'blur'}
          ],
          checkedId: [
            {required: true, message: '请选择企业类型', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入账号密码', trigger: 'blur'},
            {min: 6, max: 50, message: '长度在 6 到 20 个字符', trigger: 'blur'},
            {validator: verifyPassword, trigger: "blur"}
          ],
          password1: [
            {required: true, message: '请再次确认密码', trigger: 'blur'},
            {validator: verifyPasswords, trigger: "blur"}
          ],
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: changePhone, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入联系邮箱', trigger: 'blur'},
            {validator: changeEmail, trigger: 'blur'}
          ],
          companyName: [
            {required: true, message: '请输入企业名称', trigger: 'blur'},
          ],
          certificateAttId: [
            {validator: changeCertificateAttId, trigger: 'blur'}
          ],
          haveRead: [
            {validator: changeHaveRead, trigger: "blur"}
          ],
        },
        dialogVisible: false,
        controlBtn: false,//防止用户多次点击

      };
    },
    created: function () {
      let _this = this;
      _this.getLoadingCompanyTypeList(); //加载企业类型数据
    },
    methods: {

      //加载企业类型数据
      getLoadingCompanyTypeList() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "qylx"
          }
        }).then((res) => {
          console.log("注册数据：", res.data.data);
          _this.ruleForm.companyTypeList = res.data.data.qylx;
        });
      },

      //查看协议
      handleShowDealDialog() {
        let _this = this;
        _this.dialogVisible = true;
      },

      //闭关协议
      handleBeforeCloseUserAgreement() {
        let _this = this;
        _this.dialogVisible = false;
        _this.ruleForm.haveRead = true;
      },

      handleBeforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 20;
        let _this = this;

        if (!isJPG) {
          _this.$message.error('上传图片只能是 jpeg/png/jpg 格式!');
        }
        if (!isLt2M) {
          _this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //营业执照--上传成功
      handleAvatarSuccessBusiness(res) {
        let _this = this;
        _this.ruleForm.business = res.data;
        _this.ruleForm.certificateAttId.push(_this.ruleForm.business);
        console.log(_this.ruleForm.business);
      },
      //营业执照--删除
      handleChangeBusiness(res) {
        console.log('res', res);
      },

      //组织机构代码--上传成功
      handleAvatarSuccessDecode(res) {
        let _this = this;
        _this.ruleForm.deCode = res.data;
        _this.ruleForm.certificateAttId.push(_this.ruleForm.deCode);
      },

      //税务登记证--上传成功
      handleAvatarSuccessAdministration(res) {
        let _this = this;
        _this.ruleForm.administration = res.data;
        _this.ruleForm.certificateAttId.push(_this.ruleForm.administration);
      },

      //开户许可证--上传成功
      handleAvatarSuccessOpenAccount(res) {
        let _this = this;
        _this.ruleForm.openAccount = res.data;
        _this.ruleForm.certificateAttId.push(_this.ruleForm.openAccount);
      },

      //企业认证授权书--上传成功
      handleAvatarSuccessEnterprise(res) {
        let _this = this;
        _this.ruleForm.enterprise = res.data;
        _this.ruleForm.certificateAttId.push(_this.ruleForm.enterprise);
      },


      // 注册操作
      handleSubmitForm(ruleForm) {
        let _this = this;
        _this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            if (!_this.ruleForm.business) _this.$message({
              type: 'warning',
              message: '营业执照必传'
            });
            else if (!_this.ruleForm.deCode) _this.$message({
              type: 'warning',
              message: '组织机构代码必传'
            });
            else if (!_this.ruleForm.administration) _this.$message({
              type: 'warning',
              message: '税务登记证必传'
            });
            else
              setTimeout(() => {
                _this.controlBtn = true;
                _this.$axios({
                  method: "post",
                  url: "/user/register",
                  data: {
                    account: _this.ruleForm.userName,//用户名称
                    companyId: "",//企业ID
                    email: _this.ruleForm.email,//用户邮箱
                    enterpriseName: _this.ruleForm.companyName,//企业名称
                    enterpriseType: _this.ruleForm.checkedId,//企业类型
                    password: _this.ruleForm.password,//用户密码
                    phone: _this.ruleForm.phone,//用户手机
                    certificateAttId: _this.ruleForm.certificateAttId.join()//附件
                  }
                }).then((res) => {
                  switch (res.data.status) {
                    case 200:
                      _this.$message({
                        type: 'success',
                        message: "恭喜您，用户注册成功！"
                      });
                      _this.controlBtn = false;
                      _this.$router.push({path: "login"});//跳转到detailedMsg页面
                      break;
                  }
                })
              }, 1000);
          } else {
            _this.$message({
              type: 'warning',
              message: '页面标*的为必填项，请返回修改！'
            });
            return false
          }
        });
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
</style>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
<style lang='less' scoped>
  .register {
    .my-card {
      width: 800px;
    }
    .item-phone {
      display: inline-block;

    }
  }

  @media screen and(max-width: 1920px) {
    .register {
      margin: 60px 0 0 33%;

    }
  }

  @media screen and(max-width: 1366px) {
    .register {
      margin: 60px 0 0 45%;
    }
  }

  @media screen and(max-width: 1366px) {
    .register {
      margin: 60px 0 0 25%;
    }
  }

  .avatar-uploader-icon {
    width: 120px !important;
    height: 120px !important;
    line-height: 120px !important;
    font-size: 12px;
  }

</style>


