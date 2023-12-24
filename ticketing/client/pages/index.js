import buildClient from "../api/build-client";

const LadningPage = ({ currentUser }) => {

  return currentUser ? <h1>You are sign in</h1> : <h1>You are Not sign in</h1>;
};
LadningPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LadningPage;
