export default (request, API) => {
  const state = {
    count: 0
  }
  const mutations = {
    increment: (state) => {
      const obj = state
      obj.count += 1
    },
    decrement: (state) => {
      const obj = state
      obj.count -= 1
    }
  }
  const actions = {}
  const getters = {}
  return {
    namespaced: true,
    getters,
    state,
    mutations,
    actions
  }
}
