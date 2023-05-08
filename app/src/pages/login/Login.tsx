"use client";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";

import { useRouter } from "next/router";

import { signIn, useSession } from "next-auth/react";

const validationSchema = Yup.object().shape({
  orgNumber: Yup.string().required("orgNumber is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
const LoginPage = () => {
  const [orgNumber, setOrgNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let ret = await signIn("credentials", {
      username: orgNumber,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });
    router.push("/dashboard/gym");
    console.log("LoginPage", ret);
  };
  if (session) {
    router.push("/dashboard/gym");
    return <></>;
  }
  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      sx={{ height: "50vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' align='center' gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin='normal'
              id='orgNumber'
              name='orgNumber'
              label='OrgNumber'
              value={orgNumber}
              onChange={(e) => setOrgNumber(e.target.value)}
            />
            <TextField
              fullWidth
              margin='normal'
              id='password'
              name='password'
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant='contained' type='submit' fullWidth>
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default LoginPage;
