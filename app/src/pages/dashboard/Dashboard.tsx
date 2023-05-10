import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { NextPageContext } from "next";
function Dashboard() {
  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Welcome to the Admin Page!</p>
      <p>Loading...</p>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Dashboard;
