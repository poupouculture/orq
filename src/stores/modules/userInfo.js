import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import router from 'src/router'

const useUserInfoStore = defineStore('userInfo', {
  state () {
    return {
      userInfo: {
        access_token: '',
        expires: null,
        refresh_token: ''
      }
    }
  },
  getters: {
    token: (state) => state.userInfo.access_token
  },
  actions: {
    login (content) {
      return api.post('/auth/login', content)
        .then(({ data: { data: userinfo } }) => {
          this.userInfo = userinfo
          router.push('/HomeDrawer')
        }).catch(err => {
          console.log(err)
          return Promise.reject(err)
        })
    }
  }
})

export default useUserInfoStore
