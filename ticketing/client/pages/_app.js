import "bootstrap/dist/css/bootstrap.css";
// wrapper around the component that we're trying to show on the screen.
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
