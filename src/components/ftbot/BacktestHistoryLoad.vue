<script setup lang="ts">
import type { MsgBoxObject } from '@/components/general/MessageBox.vue';
import MessageBox from '@/components/general/MessageBox.vue';
import { useI18n } from 'vue-i18n';

import type { BacktestHistoryEntry } from '@/types';
import InfoBox from '../general/InfoBox.vue';

const botStore = useBotStore();
const msgBox = ref<typeof MessageBox>();
const filterText = ref('');
const filterTextDebounced = refDebounced(filterText, 350, { maxWait: 1000 });
const { t } = useI18n();

onMounted(() => {
  botStore.activeBot.getBacktestHistory();
});

function deleteBacktestResult(result: BacktestHistoryEntry) {
  const msg: MsgBoxObject = {
    title: t('backtestHistory.deleteTitle'),
    message: t('backtestHistory.deleteConfirm', { name: result.filename }),
    accept: () => {
      botStore.activeBot.deleteBacktestHistoryResult(result);
    },
  };
  msgBox.value?.show(msg);
}

const filteredList = computed(() =>
  botStore.activeBot.backtestHistoryList.filter(
    (r) =>
      r.filename.toLowerCase().includes(filterTextDebounced.value.toLowerCase()) ||
      r.strategy.toLowerCase().includes(filterTextDebounced.value.toLowerCase()),
  ),
);
function rowClick(row) {
  botStore.activeBot.getBacktestHistoryResult(row.data);
}
</script>

<template>
  <div>
    <Button
      class="float-end"
      :title="$t('common.refresh')"
      :aria-label="$t('common.refresh')"
      variant="outlined"
      severity="secondary"
      @click="botStore.activeBot.getBacktestHistory"
    >
      <i-mdi-refresh />
    </Button>
    <p>
      {{ $t('backtestHistory.description') }}
    </p>
    <div v-if="botStore.activeBot.backtestHistoryList.length > 0" class="flex align-center">
      <InputText
        id="trade-filter"
        v-model="filterText"
        type="text"
        size="small"
        :placeholder="$t('backtestHistory.filter')"
        :title="$t('backtestHistory.filter')"
      />
    </div>
    <DataTable
      v-if="botStore.activeBot.backtestHistoryList.length > 0"
      class="mt-2"
      responsive
      size="small"
      scrollable
      scroll-height="50rem"
      :virtual-scroller-options="{ itemSize: 46 }"
      show-gridlines
      :value="filteredList"
      @row-click="rowClick"
    >
      <Column field="strategy" :header="$t('backtestHistory.strategy')"></Column>
      <Column field="timeframe" :header="$t('backtestHistory.details')">
        <template #body="{ data }">
          <strong>{{ data.timeframe }}</strong>
          <span v-if="data.backtest_start_ts && data.backtest_end_ts" class="ms-1">
            {{ timestampToTimeRangeString(data.backtest_start_ts * 1000) }}-{{
              timestampToTimeRangeString(data.backtest_end_ts * 1000)
            }}</span
          >
        </template>
      </Column>
      <Column field="backtest_start_time" :header="$t('backtestHistory.backtestTime')">
        <template #body="{ data }">
          <DateTimeTZ :date="data.backtest_start_time * 1000" />
        </template>
      </Column>
      <Column field="filename" :header="$t('backtestHistory.filename')"></Column>
      <Column field="actions" :header="$t('common.actions')">
        <template #body="{ data }">
          <div class="flex items-center">
            <InfoBox
              v-if="botStore.activeBot.botFeatures.backtestSetNotes"
              :class="data.notes ? 'opacity-100' : 'opacity-0'"
              :hint="data.notes ?? ''"
            ></InfoBox>
            <Button
              v-if="botStore.activeBot.botFeatures.backtestDelete"
              class="ms-1"
              size="small"
              :title="$t('backtestHistory.load')"
              :disabled="data.run_id in botStore.activeBot.backtestHistory"
              @click.stop="botStore.activeBot.getBacktestHistoryResult(data)"
            >
              <template #icon>
                <i-mdi-arrow-right />
              </template>
            </Button>
            <Button
              v-if="botStore.activeBot.botFeatures.backtestDelete"
              class="ms-1"
              size="small"
              severity="secondary"
              :title="$t('backtestHistory.delete')"
              :disabled="data.run_id in botStore.activeBot.backtestHistory"
              @click.stop="deleteBacktestResult(data)"
            >
              <template #icon>
                <i-mdi-delete />
              </template>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <MessageBox ref="msgBox" />
</template>
