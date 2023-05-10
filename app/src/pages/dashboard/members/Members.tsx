import CustomSnackbar from "@/components/widgets/Snackbar";
import withAuth from "@/pages/api/auth/withAuth";
import { getMembers } from "@/services/api";
import { Add, Edit, Menu, MoreHoriz, Search } from "@mui/icons-material";
import {
  Box,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import UpdateMemberForm from "./EditMember";
import MemberForm from "./components/MemberForm";

import AddMember from "./AddMember";
import EditMemberPage from "./edit/[id]";

// The GymMember type
type GymMember = {
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
};

const Members = () => {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<GymMember[]>([]);
  const [token, setToken] = React.useState("");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<GymMember[]>([]);
  const { mutate } = useSWR("/members", getMembers);
  useEffect(() => {
    const fetchmembers = async () => {
      if (!session?.user?.token) return;

      const token = session.user.token;
      const response = await getMembers(token);
      console.log("response", response);
      setMembers(response);
      setFilteredMembers(response);
      if (!response) {
        setOpen(true);
        setToken(token);
      }
      setIsLoading(false);
    };

    fetchmembers();
  }, [session]);

  const handleSearchChange = (value: any) => {
    const query = value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredMembers([]);
    } else {
      const newFilteredMembers = members.filter(
        (member: GymMember) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
      );
      setFilteredMembers(newFilteredMembers);
    }
  };

  const handleClose = () => setOpen(false);
  const handleEdit = (member: any) => {
    console.log(member);
    router.push({
      pathname: `/dashboard/members/edit/${member}`,
    });
  };
  const gotToAddMember = () => {
    router.push("/dashboard/members/AddMember");
  };
  if (isLoading) {
    return <div>Loading gym data...</div>;
  }

  if (!members) {
    return (
      <div>
        Error loading Members data
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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box sx={{ width: "100%", maxWidth: 700, pb: 2 }}>
        <Paper
          component='form'
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",

            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            "&:hover": {
              boxShadow: "0px 4px 8px -2px rgba(0,0,0,0.3)",
            },
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label='menu'>
            <Menu />
          </IconButton>
          <InputBase
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
            placeholder='Search'
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton type='submit' sx={{ p: "10px" }} aria-label='search'>
            <Search />
          </IconButton>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title='Add Member'>
              <IconButton>
                {/* <AddMember /> */}
                <Fab
                  variant='circular'
                  color='primary'
                  onClick={gotToAddMember}
                >
                  <Add />
                </Fab>
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 700 }}>
        <Paper>
          <TableContainer component={Paper}>
            <Table aria-label='members table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member: GymMember) => (
                  <TableRow hover key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Link
                          href={`/dashboard/members/${member.id}`}
                          key={member.id}
                          passHref
                        >
                          <IconButton>
                            <MoreHoriz />
                          </IconButton>
                        </Link>
                        <Tooltip title='Edit Member'>
                          {/* <IconButton>
                            <UpdateMemberForm
                              gymId={member.gymId}
                              memberId={member.id}
                              member={member}
                            />
                          </IconButton> */}

                          <Link
                            href={`/dashboard/members/edit/${member.id}`}
                            key={member.id}
                            passHref
                          >
                            <IconButton color='info'>
                              {" "}
                              <Edit />{" "}
                            </IconButton>
                            {/* <EditMemberPage member={member} /> */}
                          </Link>
                        </Tooltip>
                        {/* There is no given Task for this  remove at the end of */}
                        {/* <Tooltip title='Delete Member'>
              <IconButton>
                <DeleteMemberTableRow
                  gymId={member.gymId}
                  memberId={member.id}
                />
              </IconButton>
            </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(Members);
