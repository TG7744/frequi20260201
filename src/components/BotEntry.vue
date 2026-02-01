<script setup lang="ts">
import type { BotDescriptor } from '@/types';
import type MessageBox from './general/MessageBox.vue';
import { useI18n } from 'vue-i18n';
const msgBox = ref<typeof MessageBox>();
const { t } = useI18n();

const props = defineProps<{
  bot: BotDescriptor;
  noButtons?: boolean;
}>();
defineEmits<{ edit: []; editLogin: [] }>();
const botStore = useBotStore();

function confirmRemoveBot() {
  botStore.removeBot(props.bot.botId);
}

function removeBotQuestion() {
  msgBox.value?.show({
    title: t('botEntry.logoutConfirmTitle'),
    message: t('botEntry.logoutConfirmMessage', {
      name: props.bot.botName,
      id: props.bot.botId,
    }),
    accept: () => {
      confirmRemoveBot();
    },
  });
}

const selectedBotStore = computed<BotSubStore>(() => {
  return botStore.botStores[props.bot.botId]!;
});

const autoRefreshLoc = computed({
  get() {
    return selectedBotStore.value.autoRefresh;
  },
  set(newValue) {
    selectedBotStore.value.setAutoRefresh(newValue);
  },
});
</script>

<template>
  <div v-if="bot" class="flex items-center justify-between w-full">
    <span class="me-2">{{ bot.botName || bot.botId }}</span>

    <div class="flex items-center gap-2">
      <div class="flex items-center">
        <ToggleSwitch v-model="autoRefreshLoc" class="mr-2" />
        <div
          v-if="selectedBotStore.isBotLoggedIn"
          :title="selectedBotStore.isBotOnline ? $t('common.online') : $t('common.offline')"
        >
          <i-mdi-circle
            class="mx-1"
            :class="selectedBotStore.isBotOnline ? 'text-green-500' : 'text-red-500'"
          />
        </div>
        <div v-else :title="$t('botEntry.loginExpired')">
          <i-mdi-cancel class="text-red-500 mx-1" />
        </div>
      </div>

      <div v-if="!noButtons" class="flex items-center gap-1">
        <Button
          v-if="selectedBotStore.isBotLoggedIn"
          size="small"
          severity="secondary"
          :title="$t('botEntry.editBot')"
          @click="$emit('edit')"
        >
          <i-mdi-pencil />
        </Button>
        <Button
          v-else
          size="small"
          severity="secondary"
          :title="$t('botEntry.loginAgain')"
          @click="$emit('editLogin')"
        >
          <i-mdi-login />
        </Button>
        <Button
          size="small"
          severity="secondary"
          :title="$t('botEntry.deleteBot')"
          @click="removeBotQuestion"
        >
          <i-mdi-delete />
        </Button>
      </div>
    </div>
    <MessageBox ref="msgBox" />
  </div>
</template>
