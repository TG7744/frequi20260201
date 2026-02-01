<script setup lang="ts">
import type { StrategyBacktestResult } from '@/types';

const props = defineProps<{
  backtestResult: StrategyBacktestResult;
}>();

const backtestResultStats = computed(() => {
  const tmp = generateBacktestMetricRows(props.backtestResult);
  return formatObjectForTable({ value: tmp }, 'metric');
});

const backtestResultSettings = computed(() => {
  // Transpose Result into readable format
  const tmp = generateBacktestSettingRows(props.backtestResult);

  return formatObjectForTable({ value: tmp }, 'setting');
});
</script>

<template>
  <div class="px-0 w-full">
    <div class="flex justify-center">
      <h3 class="font-bold text-2xl mb-2">
        {{ $t('backtestResult.title', { strategy: backtestResult.strategy_name }) }}
      </h3>
    </div>

    <div class="flex flex-col text-start ms-0 me-2 gap-2">
      <div class="flex flex-col xl:flex-row">
        <div class="px-0 px-xl-0 pe-xl-1 grow">
          <DraggableContainer :header="$t('backtestResult.strategySettings')">
            <DataTable size="small" :value="backtestResultSettings">
              <Column field="setting" :header="$t('backtestResult.setting')"></Column>
              <Column field="value" :header="$t('backtestResult.value')"></Column>
            </DataTable>
          </DraggableContainer>
        </div>
        <div class="px-0 xl:px-0 pt-2 xl:pt-0 xl:ps-1 grow">
          <DraggableContainer :header="$t('backtestResult.metrics')">
            <DataTable size="small" borderless :value="backtestResultStats">
              <Column field="metric" :header="$t('backtestResult.metric')" />
              <Column field="value" :header="$t('backtestResult.value')" />
            </DataTable>
          </DraggableContainer>
        </div>
      </div>
      <BacktestResultTablePer
        :title="$t('backtestResult.resultsPerEnter')"
        :results="backtestResult.results_per_enter_tag"
        :stake-currency="backtestResult.stake_currency"
        :key-header="$t('backtestResult.enterTag')"
        :stake-currency-decimals="backtestResult.stake_currency_decimals"
      />

      <BacktestResultTablePer
        :title="$t('backtestResult.resultsPerExitReason')"
        :results="backtestResult.exit_reason_summary ?? []"
        :stake-currency="backtestResult.stake_currency"
        :key-header="$t('backtestResult.exitReason')"
        :stake-currency-decimals="backtestResult.stake_currency_decimals"
      />

      <BacktestResultTablePer
        v-if="backtestResult.mix_tag_stats"
        :title="$t('backtestResult.resultsMixed')"
        :results="backtestResult.mix_tag_stats ?? []"
        :stake-currency="backtestResult.stake_currency"
        :key-headers="[$t('backtestResult.enterTag'), $t('backtestResult.exitTag')]"
        :stake-currency-decimals="backtestResult.stake_currency_decimals"
      />

      <BacktestResultTablePer
        :title="$t('backtestResult.resultsPerPair')"
        :results="backtestResult.results_per_pair"
        :stake-currency="backtestResult.stake_currency"
        :key-header="$t('backtestResult.pair')"
        :stake-currency-decimals="backtestResult.stake_currency_decimals"
      />
      <DraggableContainer
        v-if="backtestResult.periodic_breakdown"
        :header="$t('backtestResult.periodicBreakdown')"
      >
        <BacktestResultPeriodBreakdown :periodic-breakdown="backtestResult.periodic_breakdown">
        </BacktestResultPeriodBreakdown>
      </DraggableContainer>

      <DraggableContainer :header="$t('backtestResult.singleTrades')">
        <TradeList
          :trades="backtestResult.trades"
          :show-filter="true"
          :stake-currency="backtestResult.stake_currency"
        />
      </DraggableContainer>
    </div>
  </div>
</template>
