<script setup lang="ts">
import type { ForceExitPayload, Trade } from '@/types';
import { ref, computed } from 'vue';
import { refDebounced } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  trade: Trade;
  stakeCurrencyDecimals: number;
}>();

const model = defineModel<boolean>();

const botStore = useBotStore();
const { t } = useI18n();

const form = ref<HTMLFormElement>();
const amount = ref<number | undefined>(undefined);
const price = ref<number | undefined>(undefined);
const ordertype = ref('limit');

const checkFormValidity = () => {
  const valid = form.value?.checkValidity();

  return valid;
};

async function handleSubmit() {
  // Exit when the form isn't valid
  if (!checkFormValidity()) {
    return;
  }
  // call forceentry
  const payload: ForceExitPayload = { tradeid: String(props.trade.trade_id) };

  if (ordertype.value) {
    payload.ordertype = ordertype.value;
  }
  if (amount.value) {
    payload.amount = amount.value;
  }
  if (price.value && botStore.activeBot.botFeatures.forceExitWithPrice) {
    payload.price = price.value;
  }
  await nextTick();
  botStore.activeBot.forceexit(payload);
  model.value = false;
}

function resetForm() {
  amount.value = props.trade.amount;
  ordertype.value =
    botStore.activeBot.botState?.order_types?.force_exit ||
    botStore.activeBot.botState?.order_types?.exit ||
    'limit';
}

function handleExit() {
  // Trigger submit handler
  handleSubmit();
}

const amountDebounced = refDebounced(amount, 250, { maxWait: 500 });

const amountInBase = computed<string>(() => {
  return amountDebounced.value && props.trade.current_rate
    ? t('forceExit.estimatedValue', {
        value: formatPriceCurrency(
          amountDebounced.value * props.trade.current_rate,
          props.trade.quote_currency || '',
          props.stakeCurrencyDecimals,
        ),
      })
    : '';
});
const orderTypeOptions = computed(() => [
  { value: 'market', text: t('common.market') },
  { value: 'limit', text: t('common.limit') },
]);
</script>

<template>
  <Dialog
    v-model:visible="model"
    :header="$t('forceExit.title')"
    modal
    @show="resetForm"
    @hide="resetForm"
  >
    <form ref="form" class="space-y-4 md:min-w-[32rem]" @submit.prevent="handleSubmit">
      <div class="mb-4">
        <p class="mb-2">
          <span>{{ $t('forceExit.exiting', { id: trade.trade_id, pair: trade.pair }) }}</span>
          <br />
          <span>{{ $t('forceExit.currentlyOwning', { amount: trade.amount, base: trade.base_currency }) }}</span>
        </p>
      </div>

      <div>
        <label for="stake-input" class="block font-medium mb-1">
          {{ $t('forceExit.amountLabel', { base: trade.base_currency }) }}
          <span class="text-sm italic ml-1">{{ amountInBase }}</span>
        </label>
        <div class="space-y-2">
          <InputNumber
            id="stake-input"
            v-model="amount"
            :min="0"
            :max="trade.amount"
            :use-grouping="false"
            :step="trade.amount_precision ?? 0.000001"
            :max-fraction-digits="8"
            class="w-full"
            show-buttons
          />
          <Slider
            v-model="amount"
            :min="0"
            :max="trade.amount"
            :step="trade.amount_precision ?? 0.000001"
            class="w-full"
          />
        </div>
      </div>
      <div v-if="botStore.activeBot.botFeatures.forceExitWithPrice">
        <label for="price-input" class="block font-medium mb-1">
          {{ $t('forceExit.price') }}
          <span class="text-sm italic ml-1">{{ $t('forceExit.priceHint') }}</span>
        </label>
        <div class="space-y-2">
          <InputNumber
            id="price-input"
            v-model="price"
            :disabled="ordertype !== 'limit'"
            :min="0"
            :use-grouping="false"
            :step="trade.price_precision ?? 0.000001"
            :max-fraction-digits="8"
            class="w-full"
            show-buttons
          />
        </div>
      </div>

      <div>
        <label class="block font-medium mb-1">{{ $t('forceExit.orderType') }}</label>
        <SelectButton
          v-model="ordertype"
          :options="orderTypeOptions"
          :allow-empty="false"
          option-label="text"
          option-value="value"
          size="small"
          class="w-full"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button severity="secondary" size="small" @click="model = false">{{
          $t('common.cancel')
        }}</Button>
        <Button severity="primary" size="small" @click="handleExit">{{
          $t('forceExit.submit')
        }}</Button>
      </div>
    </template>
  </Dialog>
</template>
