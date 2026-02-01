<script setup lang="ts">
import type { BotDescriptor } from '@/types';
const props = defineProps<{
  bot: BotDescriptor;
}>();
const emit = defineEmits<{ cancelled: []; saved: [] }>();

const botStore = useBotStore();
const newName = ref<string>('');

onMounted(() => {
  newName.value = props.bot.botName;
});

const save = () => {
  botStore.updateBot(props.bot.botId, {
    botName: newName.value,
  });

  emit('saved');
};
</script>

<template>
  <form class="flex w-full gap-2" @submit.prevent="save">
    <InputText
      v-model="newName"
      size="small"
      class="w-full"
      :placeholder="$t('botEntry.namePlaceholder')"
      autofocus
    />

    <div class="flex gap-1">
      <Button
        type="submit"
        size="small"
        severity="secondary"
        :title="$t('common.save')"
        class="w-8 h-8 p-0!"
      >
        <i-mdi-check />
      </Button>

      <Button
        size="small"
        severity="secondary"
        :title="$t('common.cancel')"
        class="w-8 h-8 p-0!"
        @click="$emit('cancelled')"
      >
        <i-mdi-close />
      </Button>
    </div>
  </form>
</template>
