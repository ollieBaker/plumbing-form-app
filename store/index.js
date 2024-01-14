export const actions = {
  getFormData({ state, dispatch }) {
    const { signature } = state.auth.user;
    const id = signature.id ? signature.id : signature;
    console.log("Signature is ID", signature);
    return Promise.all([
      dispatch("site/getSiteInfo"),
      dispatch("site/getLocationOptions"),
      signature ? dispatch("user/getSignature", id) : Promise.resolve()
    ]);
  }
};
