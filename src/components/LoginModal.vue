<script setup lang="ts">
import type { AuthStorageWithBotId } from '@/types';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    loginText?: string;
  }>(),
  {
    loginText: '',
  },
);
const loginViewOpen = ref(false);
const loginInfo = ref<AuthStorageWithBotId | undefined>(undefined);
const { t } = useI18n();
const displayLoginText = computed(() => props.loginText || t('common.login'));

const handleLoginResult = (result: boolean) => {
  if (result) {
    loginViewOpen.value = false;
  }
};

const openLoginModal = async (botInfo: AuthStorageWithBotId | undefined = undefined) => {
  loginInfo.value = botInfo;
  await nextTick();
  loginViewOpen.value = true;
};
defineExpose({
  openLoginModal,
});
</script>

<template>
  <div>
    <Button severity="secondary" @click="openLoginModal()"
      ><i-mdi-login class="me-1" />{{ displayLoginText }}</Button
    >
    <Dialog
      id="modal-prevent-closing"
      v-model:visible="loginViewOpen"
      :header="$t('login.modalTitle')"
      :dismissable-mask="true"
    >
      <BotLogin
        class="w-[1000px] max-w-[500px]"
        in-modal
        :existing-auth="loginInfo"
        @login-result="handleLoginResult"
      />
    </Dialog>
  </div>
</template>
