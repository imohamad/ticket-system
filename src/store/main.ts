import { acceptHMRUpdate, defineStore } from 'pinia'

interface RootState {

}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
  }),
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))

