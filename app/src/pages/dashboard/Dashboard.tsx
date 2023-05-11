import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { NextPageContext } from "next";
import { Box } from "@mui/material";
function Dashboard() {
  return (
    <Layout>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", maxWidth: 700, pb: 2 }}>
          <h1>Dashboard</h1>
          <p>Welcome to the Admin Page!</p>
          <p>Loading...</p>
        </Box>
      </Box>
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
