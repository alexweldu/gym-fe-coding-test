import { getMembersByID } from "@/services/api";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface GymMember {
  id: number;
  name: string;
  email: string;
  startedOn: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  gymId: number;
}

export default function Member() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState<GymMember | null>(null);
  const { data: session } = useSession();
  const isEditPage = router.pathname.includes("/edit");

  useEffect(() => {
    const fetchMember = async () => {
      if (!session?.user?.token) return;

      const token = session.user.token;

      const response = await getMembersByID(id, token);

      setMember(response);
    };

    if (id) {
      fetchMember();
    }
  }, [id, session?.user.token]);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth='md'>
      <Box sx={{ mt: 2 }}>
        <Typography variant='h4' gutterBottom>
          Member Details
        </Typography>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              "& > :not(style)": {
                m: 1,
                width: 400,
              },
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Name: {member.name}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Email: {member.email}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Gym ID: {member.gymId}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Address
              </Typography>
              <Typography variant='body1' gutterBottom>
                State: {member.address.state}
              </Typography>
              <Typography variant='body1' gutterBottom>
                City: {member.address.city}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Street: {member.address.street}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Zip Code: {member.address.zip}
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Link href='/dashboard/members' passHref>
              <Button variant='contained'>Back to Members</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
