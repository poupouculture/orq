import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import useRouter from 'src/router'

const router = useRouter()

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
    token: (state) => state.access_token
  },
  actions: {
    login (content) {
      return api.post('/auth/login', content)
        .then(({ data: userInfo }) => {
          this.userInfo = userInfo
          router.push('/dashboard')
        }).catch(err => {
          console.log(err)
        })
    }
  }
})

export default useUserInfoStore
