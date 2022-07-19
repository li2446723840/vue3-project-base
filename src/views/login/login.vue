<script setup lang="ts">
  import { validRule } from "@/utils/validRule";
  import { sendMsg, getcaptchaoflogin, login } from "@/api/login";
  import { useUserStore } from "@/store/modules/user";
  import { useRouter, useRoute } from "vue-router";

  const loginData = reactive({
    phone: "", // 手机号
    code: "", // 短信验证码
    textCode: "", // 图形验证码
    hxe_c_code: "", // 图形验证code
    hxe_mc_code: "", // 短信验证code
    imgSrc: "", // 图形验证码链接
    showImg: false, // 控制是否展示图形验证码
    autoLogin: 1, // 是否七天免密登录， 1是 0否
  });
  const loginForm = ref(null);
  const sendFlag = ref(false);
  const hasSend = ref(false);
  const seconds = ref(59);
  const initSeconds = ref(59);
  let timer: ReturnType<typeof setInterval>;
  const loading = ref(false);
  const appKey = import.meta.env.VITE_APP_KEY; // 获取appkey
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  /**
   * @description 发送验证码
   */
  async function sendCode() {
    const params = loginData.showImg
      ? { appKey, phone: loginData.phone, text: loginData.textCode }
      : { appKey, phone: loginData.phone };
    console.log(params);
    const { code, data } = await sendMsg(params);
    if (code === 0) {
      hasSend.value = true;
      loginData.hxe_c_code = data.token;
      getSeconds(initSeconds.value);
    } else if (code === 10116) {
      ElMessage.warning("为保证您的安全，请先输入图形验证码");
      _getcaptchaoflogin();
    } else if (code === 10115) {
      ElMessage.error("图形验证码错误");
      _getcaptchaoflogin();
    }
  }
  async function _getcaptchaoflogin() {
    loginData.textCode = "";
    const res = await getcaptchaoflogin({ appKey });
    const url = window.URL.createObjectURL(res);
    loginData.imgSrc = url;
    loginData.showImg = true;
  }
  // 发送短信读秒
  function getSeconds(count: number) {
    clearInterval(timer);
    sendFlag.value = true;
    seconds.value = count;
    timer = setInterval(() => {
      seconds.value--;
      if (seconds.value <= 0) {
        sendFlag.value = false;
        clearInterval(timer);
      }
    }, 1000);
  }
  function loginHandle() {
    // @ts-expect-error
    loginForm.value.validate(async (valid) => {
      if (valid) {
        const webappLoginByMsgVI = {
          appKey,
          areaCode: "+86",
          code: loginData.code,
          phone: loginData.phone.toString(),
          platform: "web",
          rememberMe: loginData.autoLogin,
          timestamp: new Date().getTime(),
          responseType: "code",
          state: "string",
        };
        loading.value = true;
        const { code, data } = await login(webappLoginByMsgVI, {
          hxe_mc_code: loginData.hxe_mc_code,
        });
        loading.value = false;
        if (code !== 0) {
          return;
        }
        try {
          const toRes: any = await userStore.setToken({
            code: data.code,
            rememberMe: Number(loginData.autoLogin),
            state: new Date().getTime(),
          });
          loading.value = false;
          if (toRes.code === 0) {
            if (route.query.redirect) {
              router.replace(route.query.redirect as string);
            } else {
              router.replace("/dashboard");
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
</script>
<template>
  <div class="login">
    <div class="login-box">
      <h2 class="login-til">
        <div class="login-til-d1"></div>
      </h2>
      <div class="login-con">
        <div class="login-desc">
          <h3>登录账号</h3>
          <p>仅限已注册手机登录</p>
        </div>
        <el-form ref="loginForm" :model="loginData">
          <el-form-item prop="phone" :rules="validRule(['required', 'phone'], '请输入正确手机号')">
            <div class="login-item">
              <div class="login-item-desc">+86</div>
              <el-input
                v-model="loginData.phone"
                class="login-indent"
                placeholder="请输入手机号"
                maxlength="11"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item
            v-if="loginData.showImg"
            prop="textCode"
            :rules="validRule('required', '请输入图形验证码')"
          >
            <div class="login-item">
              <el-input
                v-model="loginData.textCode"
                placeholder="请输入图形验证码"
                maxlength="6"
              ></el-input>
              <el-image :src="loginData.imgSrc" @click="_getcaptchaoflogin"></el-image>
            </div>
          </el-form-item>
          <el-form-item prop="code" :rules="validRule('required', '请输入验证码')">
            <div class="login-item">
              <el-input
                v-model="loginData.code"
                placeholder="请输入验证码"
                maxlength="6"
              ></el-input>
              <el-button v-if="!sendFlag" type="text" :disabled="!loginData.phone" @click="sendCode"
                >获取验证码</el-button
              >
              <el-button v-else type="text">{{ seconds }}s后重新获取</el-button>
            </div>
          </el-form-item>
          <el-button
            type="primary"
            size="large"
            :disabled="!hasSend"
            :loading="loading"
            class="login-btn"
            @click="loginHandle"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .login {
    height: 100vh;
    width: 100%;
    background-color: #edf0f2;
    background-size: 100% 100%;
    overflow: hidden;
    position: relative;
    padding: 0;
    .login-box {
      width: 420px;
      margin: 0 auto;
      position: relative;
      top: 50%;
      margin-top: -300px;
      .login-til {
        text-align: center;
        .login-til-d1 {
          img {
            width: auto;
          }
        }
        .login-til-d2 {
          img {
            width: 71px;
          }
        }
        div:last-child {
          margin-top: 8px;
        }
      }
      .login-con {
        margin-top: 30px;
        background: #ffffff;
        text-align: center;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.12);
        border-radius: 6px;
        .login-desc {
          padding: 0 28px;
          background: #ffffff;
          position: relative;
          // height: 120px;
          // border-radius: 4px 4px 0 0;
          h3 {
            font-size: 24px;
            color: #1b2a38;
            font-weight: bold;
            padding-top: 30px;
          }
          p {
            font-size: 14px;
            color: #adb2b8;
            padding-top: 5px;
          }
          i {
            font-size: 65px;
            color: #dddddd;
            position: absolute;
            right: 27px;
            top: 29px;
          }
        }
        .el-form {
          padding: 32px 25px 60px 25px;
          // background: #eee;
          // border-radius: 0 0 4px 4px;
          .login-item {
            position: relative;
            width: 100%;
            .login-item-desc {
              position: absolute;
              height: 100%;
              width: 60px;
              line-height: 50px;
              text-align: center;
              z-index: 99;
              &:after {
                content: "";
                height: 20px;
                width: 1px;
                background-color: #ced7e0;
                position: absolute;
                right: 9px;
                top: 15px;
              }
            }
            .el-button {
              position: absolute;
              right: 20px;
              top: 11px;
            }
            .el-image {
              height: 100%;
              width: 120px;
              position: absolute;
              z-index: 99;
              right: 0;
            }
          }
        }
        .login-btn {
          width: 100%;
          // background-color: #0099ff;
          // &:hover {
          //   opacity: 0.9;
          // }
        }
      }
    }
    .login-foot {
      position: absolute;
      bottom: 50px;
      width: 100%;
      text-align: center;
      color: #a9a9a9;
    }
  }
  .record-box {
    position: absolute;
    bottom: 65px;
    width: 100%;
    text-align: center;
    color: #8b959e;
    font-size: 12px;
    .rb-item {
      line-height: 22px;
      img {
        vertical-align: middle;
      }
      .rb-item-mgl {
        margin-left: 10px;
      }
      .rb-item-mgr {
        margin-right: 10px;
      }
    }
  }
</style>
<style lang="less">
  .login-con {
    .el-input__inner {
      background: #ffffff;
      height: 50px;
      outline: none;
      color: #606266;
    }
    .el-form-item {
      border-radius: 5px;
    }
    .login-item {
      .login-indent {
        .el-input__inner {
          text-indent: 45px;
        }
      }
    }
  }
</style>
