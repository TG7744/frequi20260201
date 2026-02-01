<script setup lang="ts">
import { FtWsMessageTypes } from '@/types/wsMessageTypes';
import { useI18n } from 'vue-i18n';

const settingsStore = useSettingsStore();
const colorStore = useColorStore();
const layoutStore = useLayoutStore();
const { t } = useI18n();

const timezoneOptions = ['UTC', Intl.DateTimeFormat().resolvedOptions().timeZone];
const openTradesOptions = computed(() => [
  { value: OpenTradeVizOptions.showPill, text: t('settings.openTrades.showPill') },
  { value: OpenTradeVizOptions.asTitle, text: t('settings.openTrades.showTitle') },
  { value: OpenTradeVizOptions.noOpenTrades, text: t('settings.openTrades.hide') },
]);
const colorPreferenceOptions = computed(() => [
  { value: ColorPreferences.GREEN_UP, text: t('settings.colors.greenUp') },
  { value: ColorPreferences.RED_UP, text: t('settings.colors.redUp') },
]);

const resetDynamicLayout = () => {
  layoutStore.resetTradingLayout();
  layoutStore.resetDashboardLayout();
  showAlert(t('settings.resetSuccess'));
};
</script>

<template>
  <Card class="mx-auto mt-3 p-4 max-w-4xl">
    <template #title>{{ $t('settings.title') }}</template>
    <template #content>
      <div class="flex flex-col gap-4 text-start dark:text-surface-300">
        <p class="text-left">{{ $t('settings.uiVersion') }}: {{ settingsStore.uiVersion }}</p>

        <div class="border border-surface-400 rounded-sm p-4 space-y-4">
          <h4 class="text-xl font-semibold">{{ $t('settings.uiSection') }}</h4>

          <BaseCheckbox v-model="layoutStore.layoutLocked" class="space-y-1">
            {{ $t('settings.lockLayouts') }}
            <template #hint>
              {{ $t('settings.lockLayoutsHint') }}
            </template>
          </BaseCheckbox>

          <div class="flex flex-row items-center gap-2 space-y-2">
            <Button severity="secondary" size="small" class="mb-0" @click="resetDynamicLayout"
              >{{ $t('settings.resetLayout') }}</Button
            >
            <small class="block text-surface-600 dark:text-surface-400"
              >{{ $t('settings.resetLayoutHint') }}</small
            >
          </div>

          <Divider />

          <div class="space-y-1">
            <label class="block text-sm">{{ $t('settings.openTradesLabel') }}</label>
            <Select
              v-model="settingsStore.openTradesInTitle"
              :options="openTradesOptions"
              option-label="text"
              option-value="value"
              size="small"
              class="w-full"
            />
            <small class="text-surface-600 dark:text-surface-400"
              >{{ $t('settings.openTradesHint') }}</small
            >
          </div>

          <div class="space-y-1">
            <label class="block text-sm">{{ $t('settings.timezoneLabel') }}</label>
            <Select
              v-model="settingsStore.timezone"
              :options="timezoneOptions"
              class="w-full"
              size="small"
            />
            <small class="text-surface-600 dark:text-surface-400"
              >{{ $t('settings.timezoneHint') }}</small
            >
          </div>

          <BaseCheckbox v-model="settingsStore.backgroundSync" class="space-y-1">
            {{ $t('settings.backgroundSync') }}
            <template #hint> {{ $t('settings.backgroundSyncHint') }} </template>
          </BaseCheckbox>

          <BaseCheckbox v-model="settingsStore.confirmDialog" class="space-y-1">
            {{ $t('settings.confirmDialog') }}
            <template #hint>{{ $t('settings.confirmDialogHint') }}</template>
          </BaseCheckbox>

          <BaseCheckbox v-model="settingsStore.multiPaneButtonsShowText" class="space-y-1">
            {{ $t('settings.multiPaneText') }}
            <template #hint>{{ $t('settings.multiPaneHint') }}</template>
          </BaseCheckbox>
        </div>

        <div class="border border-surface-400 rounded-sm p-4 space-y-4">
          <h4 class="text-lg font-semibold">{{ $t('settings.chartSection') }}</h4>

          <div class="space-y-1">
            <label class="block text-sm">{{ $t('settings.chartScale') }}</label>
            <div class="flex gap-4">
              <div class="flex items-center">
                <RadioButton v-model="settingsStore.chartLabelSide" value="left" size="small" />
                <label class="ml-2">{{ $t('common.left') }}</label>
              </div>
              <div class="flex items-center">
                <RadioButton v-model="settingsStore.chartLabelSide" value="right" size="small" />
                <label class="ml-2">{{ $t('common.right') }}</label>
              </div>
            </div>
            <small class="text-surface-600 dark:text-surface-400">
              {{ $t('settings.chartScaleHint') }}
            </small>
          </div>

          <BaseCheckbox v-model="settingsStore.useHeikinAshiCandles" class="space-y-1">
            {{ $t('settings.heikinAshi') }}
            <template #hint>{{ $t('settings.heikinAshiHint') }}</template>
          </BaseCheckbox>

          <BaseCheckbox v-model="settingsStore.useReducedPairCalls" class="space-y-1">
            {{ $t('settings.reducedCalls') }}
            <template #hint>{{ $t('settings.reducedCallsHint') }}</template>
          </BaseCheckbox>

          <div>
            <p>{{ $t('settings.defaultCandles') }}</p>
            <div class="flex flex-row gap-5 w-full items-center">
              <Slider
                v-model="settingsStore.chartDefaultCandleCount"
                class="flex-1"
                :step="50"
                :min="100"
                :max="2000"
              />
              <InputNumber
                v-model="settingsStore.chartDefaultCandleCount"
                :step="50"
                :min="100"
                :max="2000"
                size="small"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block">{{ $t('settings.candleColorPref') }}</label>
            <div class="flex flex-row gap-5 items-center">
              <div
                v-for="option in colorPreferenceOptions"
                :key="option.value"
                class="flex items-center"
              >
                <RadioButton
                  v-model="colorStore.colorPreference"
                  :value="option.value"
                  :input-id="`input-id${option.value}`"
                  size="small"
                  @change="colorStore.updateProfitLossColor"
                />
                <label :for="`input-id${option.value}`" class="ml-2 flex items-center">
                  <span class="mr-2">{{ option.text }}</span>
                  <i-mdi-arrow-up-thin
                    :color="
                      option.value === ColorPreferences.GREEN_UP
                        ? colorStore.colorProfit
                        : colorStore.colorLoss
                    "
                    class="-ml-2"
                  />
                  <i-mdi-arrow-down-thin
                    :color="
                      option.value === ColorPreferences.GREEN_UP
                        ? colorStore.colorLoss
                        : colorStore.colorProfit
                    "
                    class="-ml-2"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="border rounded-sm p-4 space-y-4">
          <h4 class="text-lg font-semibold">{{ $t('settings.notifications') }}</h4>
          <div class="space-y-2">
            <BaseCheckbox v-model="settingsStore.notifications[FtWsMessageTypes.entryFill]">
              {{ $t('settings.notify.entry') }}
            </BaseCheckbox>
            <BaseCheckbox v-model="settingsStore.notifications[FtWsMessageTypes.exitFill]">
              {{ $t('settings.notify.exit') }}
            </BaseCheckbox>
            <BaseCheckbox v-model="settingsStore.notifications[FtWsMessageTypes.entryCancel]">
              {{ $t('settings.notify.entryCancel') }}
            </BaseCheckbox>
            <BaseCheckbox v-model="settingsStore.notifications[FtWsMessageTypes.exitCancel]">
              {{ $t('settings.notify.exitCancel') }}
            </BaseCheckbox>
          </div>
        </div>

        <div class="border rounded-sm p-4 space-y-4">
          <h4 class="text-lg font-semibold">{{ $t('settings.backtestSection') }}</h4>
          <div>
            <label for="backtestMetrics" class="block text-sm">{{
              $t('settings.backtestMetrics')
            }}</label>
            <MultiSelect
              id="backtestMetrics"
              v-model="settingsStore.backtestAdditionalMetrics"
              :options="availableBacktestMetrics"
              option-label="header"
              option-value="field"
              class="w-full"
              size="small"
              display="chip"
            />
            <small class="text-surface-600 dark:text-surface-400"
              >{{ $t('settings.backtestMetricsHint') }}</small
            >
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
