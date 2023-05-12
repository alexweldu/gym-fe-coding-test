import CustomSnackbar from "@/components/widgets/Snackbar";
import withAuth from "@/pages/api/auth/withAuth";
import { getGym } from "@/services/api";
import { Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GymCard from "./components/GymCard";

interface GymResponse {
  id: number;
  name: string;
  location: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  orgNumber: string;
  password: string;
}

const Gym = () => {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [gymData, setGymData] = useState<GymResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGymData = async () => {
      if (!session?.user?.token) return;
      const url = "/gym";
      const token = session.user.token;
      const response = await getGym(token);
      setGymData(response);
      if (!response) {
        setOpen(true);
      }
      setIsLoading(false);
    };
    fetchGymData();
  }, [session]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  if (isLoading) {
    return <div>Loading gym data...</div>;
  }

  if (!gymData) {
    return (
      <div>
        Error loading gym data
        <CustomSnackbar
          open={open}
          onClose={handleClose}
          message='Error loading gym data!'
          severity='error'
        />
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid key={0} item xs={12} sm={6} md={4} lg={3}>
          <GymCard gymData={gymData} />
        </Grid>
      </Grid>
    </>
  );
};
export default withAuth(Gym);
