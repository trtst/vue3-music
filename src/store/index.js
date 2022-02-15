import { createStore } from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

const store = createStore({
    state,
    mutations,
    getters,
    actions
});

export default store