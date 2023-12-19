<script setup lang="ts">
// const route = useRoute('/adminLogin')
import { reactive } from 'vue'
import dayjs from "dayjs";
import API from "~/api/requests";
const router = useRouter()

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})
const onFinish = (values: any) => {
  submit(formState);
  console.log('Success:', values)

}
async function submit(formState: FormState) {
  await API({
    url: '/admin/login',
    method: 'post',
    data: {
      username: formState.username,
      password: formState.password,
    },
  }).then((res) => {
    // dataList.value = res.data;
    console.log(res.data)
    if (res.data === 0) {
      router.push(`/admin`)
    }
    // bool = res.data[0].user_phone !== undefined;
  });
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

</script>

  <template>
  <div i-carbon-user-admin class="text-4xl -mb-6 m-auto" />
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="margin-top: 100px"
      class="m-auto"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 7, span: 10 }">
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <a-button style="margin-left: 10px"  html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </template>


