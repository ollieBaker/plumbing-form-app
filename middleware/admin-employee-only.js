export default function({ store, redirect }) {
  // If the user is not authenticated
  const { name } = store.state.auth.user.role;
  const allowed = ["Administrator", "Office Employee"];

  if (!allowed.includes(name)) {
    return redirect("/");
  }
}
