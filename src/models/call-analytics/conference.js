export default {
    namespace: "conference",
    state: [],
    reducers: {
      delete(state, { payload: id }) {
        return state.filter(item => item.id !== id);
      },
      get_users(state, {}) {
          return 
      }
    }
  };
  