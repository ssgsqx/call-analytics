export default {
  namespace: "callAnalytics",
  state: [],
  reducers: {
    delete(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
    
  }
};
