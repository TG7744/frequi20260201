<template>
  <div>
    <h1 class="mb-5">{{ $t('error404.title') }}</h1>
    <p class="h4">{{ $t('error404.message') }}</p>
    <p>
      {{ $t('error404.backPrefix') }}
      <RouterLink to="/"> <span>{{ $t('error404.backLink') }}</span> </RouterLink
      >.
    </p>
  </div>
</template>
