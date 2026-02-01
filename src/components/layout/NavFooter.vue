<script setup lang="ts">
const botStore = useBotStore();
</script>

<template>
  <footer class="md:hidden">
    <!-- Only visible on xs (phone) viewport! -->
    <hr class="my-0" />
    <div class="flex gap-2 justify-between px-2">
      <Button
        v-if="!botStore.canRunBacktest"
        icon-pos="top"
        variant="link"
        size="small"
        as="router-link"
        class="align-items-center"
        to="/open_trades"
        :label="$t('footer.trades')"
      >
        <template #icon>
          <i-mdi-folder-open height="24" width="24" />
        </template>
      </Button>
      <Button
        v-if="!botStore.canRunBacktest"
        icon-pos="top"
        variant="link"
        size="small"
        as="router-link"
        class="align-items-center"
        to="/trade_history"
        :label="$t('footer.history')"
      >
        <template #icon>
          <i-mdi-folder-lock height="24" width="24" />
        </template>
      </Button>
      <Button
        v-if="!botStore.canRunBacktest"
        icon-pos="top"
        variant="link"
        size="small"
        as="router-link"
        class="align-items-center"
        to="/pairlist"
        :label="$t('footer.pairlist')"
      >
        <template #icon>
          <i-mdi-view-list height="24" width="24" />
        </template>
      </Button>
      <Button
        v-if="!botStore.canRunBacktest"
        icon-pos="top"
        variant="link"
        size="small"
        as="router-link"
        class="align-items-center"
        to="/balance"
        :label="$t('footer.balance')"
      >
        <template #icon>
          <i-mdi-bank height="24" width="24" />
        </template>
      </Button>
      <Button
        v-if="!botStore.canRunBacktest"
        icon-pos="top"
        variant="link"
        size="small"
        as="router-link"
        class="align-items-center"
        to="/dashboard"
        :label="$t('nav.dashboard')"
      >
        <template #icon>
          <i-mdi-view-dashboard-outline height="24" width="24" />
        </template>
      </Button>
    </div>
  </footer>
</template>
