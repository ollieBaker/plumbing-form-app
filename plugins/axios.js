export default function({ $axios, redirect }) {
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    console.log("Error:", code, error.response);
    if (code === 401) {
      redirect("/login");
    }
  });
}
