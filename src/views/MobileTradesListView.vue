<script setup lang="ts">
defineProps<{
  history?: boolean;
}>();
const botStore = useBotStore();
</script>

<template>
  <div>
    <!-- <TradeList
      class="open-trades"
      :trades="openTrades"
      title="Open trades"
      :active-trades="true"
      empty-text="Currently no open trades."
    /> -->
    <CustomTradeList
      v-if="!history && !botStore.activeBot.detailTradeId"
      :trades="botStore.activeBot.openTrades"
      :title="$t('trading.openTrades')"
      :active-trades="true"
      :stake-currency-decimals="botStore.activeBot.stakeCurrencyDecimals"
      :empty-text="$t('trading.noOpenTrades')"
    />
    <CustomTradeList
      v-if="history && !botStore.activeBot.detailTradeId"
      :trades="botStore.activeBot.closedTrades"
      :title="$t('trading.tradeHistory')"
      :stake-currency-decimals="botStore.activeBot.stakeCurrencyDecimals"
      :empty-text="$t('trading.noClosedTrades')"
    />
    <div
      v-if="botStore.activeBot.detailTradeId && botStore.activeBot.tradeDetail"
      class="flex flex-col"
    >
      <Button
        size="small"
        severity="secondary"
        class="self-start my-1 ms-1"
        @click="botStore.activeBot.setDetailTrade(null)"
        ><i-mdi-arrow-left /> {{ $t('common.back') }}</Button
      >
      <TradeDetail
        :trade="botStore.activeBot.tradeDetail"
        :stake-currency="botStore.activeBot.stakeCurrency"
      />
    </div>
  </div>
</template>
