<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const { t } = useI18n()

const ticketList = ref([{
  id: 1,
  origin: 'تهران',
  destination: 'شیراز',
  price: 100,
}, {
  id: 2,
  origin: 'اصفهان',
  destination: 'مشهد',
  price: 400,
}, {
  id: 3,
  origin: 'شیراز',
  destination: 'اهواز',
  price: 347,
}, {
  id: 4,
  origin: 'رامسر',
  destination: 'کیش',
  price: 1200,
}])

function Ticket({ id, origin, destination, price }) {
  this.id = id
  this.origin = origin
  this.destination = destination
  this.price = price
}

function Cart() {
  this.items = []
}

Cart.prototype.addItem = function (ticket) {
  this.items.push(ticket)
  this.getTicketsList()
}

Cart.prototype.getTicketsList = function () {
  // eslint-disable-next-line no-console
  console.log(this.items)
  return this.items
}

const cart = new Cart()
const addToCart = newTicket => cart.addItem(new Ticket(newTicket))
</script>

<template>
  <div class="flex justify-between m-auto mt-4 w-4xl">
    <div v-for="ticket in ticketList" :key="ticket.id" class="ticket-wrapper">
      {{ t('fly') }}
      <span class="fw-bold">
        {{ ticket.origin }}
      </span>
      {{ t('to') }}
      <span class="fw-bold">
        {{ ticket.destination }}
      </span>
      {{ t('amount') }}
      <span class="fw-bold">
        {{ ticket.price }}
      </span>
      {{ t('rials') }}
      <br>
      <br>
      <button class="mr-2 bg-emerald px-2 py-1" type="button" @click="addToCart(ticket)">
        {{ t('buy') }}
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .ticket-wrapper {
    @apply border-2 border-yellow mb-2;
    height: 100px;
    width: 300px;
  }
</style>

<i18n lang="json">
{
  "en": {
    "fly": "Fly from",
    "to": "to",
    "amount": "amount of",
    "rials": "rials",
    "buy": "buy",
    "transactions": "Transactions"
  },
  "fa": {
    "fly": "پرواز از",
    "to": "به",
    "amount": "به مبلغ",
    "rials": "ریال",
    "buy": "خرید",
    "transactions": "تراکنش‌ها"
  }
}
</i18n>
