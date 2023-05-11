import CustomSnackbar from "@/components/widgets/Snackbar";
import withAuth from "@/pages/api/auth/withAuth";
import { createMembers, getMembers } from "@/services/api";
import { Menu, MoreHoriz, Search } from "@mui/icons-material";
import {
  Box,
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
import useSWR, { mutate } from "swr";

import AddMember from "./AddMember";
import UpdateMemberFormWith from "./EditMember";
import DeleteMemberTableRow from "./components/DeleteDialog";
import { enqueueSnackbar } from "notistack";
import { getCookie, setCookie } from "cookies-next";

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
  // const [isLoading, setIsLoading] = useState(true);
  // const [members, setMembers] = useState<GymMember[]>([]);
  const [token, setToken] = React.useState("");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<GymMember[]>([]);

  useEffect(() => {
    const fetchmembers = async () => {
      if (!session?.user?.token) return;
      setCookie("mtoken", session.user.token);
      const token = session.user.token;
      const response = await getMembers(token);
      setToken(token);
      console.log("response", response);

      setFilteredMembers(response);
      if (!response) {
        setOpen(true);
        setToken(token);
      }
    };

    fetchmembers();
  }, [session]);

  const handleSearchChange = (value: any) => {
    const query = value.toLowerCase();
    setSearchQuery(query);
  };

  const handleClose = () => setOpen(false);
  const submitData = async (values: any) => {
    try {
      const value = undefined;
      const token = getCookie("mtoken");

      const resp = await createMembers(values, token);
      if (resp) {
        enqueueSnackbar({
          message: "Successfully Add",
          variant: "success",
          autoHideDuration: 3000,
        });
        const token = getCookie("mtoken");
        const response = await getMembers(token as string);
        setFilteredMembers(response);
      }
    } catch (error) {
      console.log("mmmmmmm", error);
    }
  };
  const handleRefresh = async () => {
    const token = getCookie("mtoken");
    const response = await getMembers(token as string);
    setFilteredMembers(response);
  };

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
            <AddMember onSubmit={submitData} />
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

                        <UpdateMemberFormWith
                          member={member}
                          refresh={handleRefresh}
                        />

                        {/* There is no given Task for this  remove at the end of */}
                        <Tooltip title='Delete Member'>
                          <IconButton>
                            <DeleteMemberTableRow
                              refresh={handleRefresh}
                              gymId={member.gymId}
                              memberId={member.id}
                            />
                          </IconButton>
                        </Tooltip>
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
