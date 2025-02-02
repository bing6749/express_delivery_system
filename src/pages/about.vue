<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const type = ref('agreement')

onMounted(() => {
  type.value = route.query.type as string || 'agreement'
})
</script>

<template>
  <div class="about-container">
    <div v-if="type === 'agreement'" class="agreement">
      <h1>用户协议</h1>
      <section>
        <h2>1. 服务条款</h2>
        <p>欢迎使用校园快递服务平台。在使用本平台服务之前，请您仔细阅读以下条款。使用本服务即表示您同意接受这些条款的约束。</p>
      </section>

      <section>
        <h2>2. 账号注册与安全</h2>
        <p>2.1 用户需提供真实、准确的个人信息进行注册。</p>
        <p>2.2 用户应妥善保管账号和密码，对账号下的所有行为负责。</p>
      </section>

      <section>
        <h2>3. 服务内容</h2>
        <p>3.1 本平台提供校园快递代收、代取等服务。</p>
        <p>3.2 平台保留随时修改或中断服务的权利。</p>
      </section>

      <section>
        <h2>4. 用户责任</h2>
        <p>4.1 用户应遵守相关法律法规。</p>
        <p>4.2 不得利用本平台从事违法活动。</p>
      </section>

      <section>
        <h2>5. 免责声明</h2>
        <p>5.1 对于因不可抗力导致的服务中断，平台不承担责任。</p>
        <p>5.2 用户因违反本协议造成的损失由用户自行承担。</p>
      </section>
    </div>

    <div v-else class="privacy">
      <h1>隐私政策</h1>
      <section>
        <h2>1. 信息收集</h2>
        <p>1.1 我们收集的信息包括：手机号、收货地址等。</p>
        <p>1.2 我们承诺依法保护用户的个人信息安全。</p>
      </section>

      <section>
        <h2>2. 信息使用</h2>
        <p>2.1 收集的信息仅用于提供快递服务。</p>
        <p>2.2 未经用户同意，不会向第三方提供用户信息。</p>
      </section>

      <section>
        <h2>3. 信息保护</h2>
        <p>3.1 采用加密技术保护用户数据。</p>
        <p>3.2 定期评估信息安全风险。</p>
      </section>

      <section>
        <h2>4. 信息共享</h2>
        <p>4.1 仅在必要时与快递公司共享配送信息。</p>
        <p>4.2 严格审核第三方合作伙伴资质。</p>
      </section>

      <section>
        <h2>5. 用户权利</h2>
        <p>5.1 用户有权查询、更正自己的信息。</p>
        <p>5.2 用户可以选择注销账号。</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #1890ff;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}
</style>
