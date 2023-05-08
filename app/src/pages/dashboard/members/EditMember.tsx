import CustomSnackbar from "@/components/widgets/Snackbar";
import { getMembers, updateMember } from "@/services/api";
import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
interface GymMember {
  id: number;
  gymId: number;
  name: string;
  email: string;
  startedOn: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface Props {
  gymId: number;
  memberId: number;
  member: GymMember;
}

const UpdateMemberForm = ({ gymId, memberId, member }: Props) => {
  const [updating, setUpdating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: member?.name ?? "",
      email: member?.email ?? "",
      address: {
        street: member?.address?.street ?? "",
        city: member?.address?.city ?? "",
        state: member?.address?.state ?? "",
        zip: member?.address?.zip ?? "",
      },
    },
    onSubmit: async (values) => {
      try {
        setUpdating(true);
        if (!session?.user?.token) return;

        const token = session.user.token;
        const res = await updateMember(memberId, gymId, values, token);

        if (!res) {
          return (
            <CustomSnackbar
              message='Updated'
              severity='success'
              autoHideDuration={600}
              open={open}
              onClose={handleClose}
            />
          );
        }
        //   const res = await update(values, token);
        // const res = await fetch(`/members/${memberId}`, {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: "Bearer " + token,
        //   },
        //   body: JSON.stringify({
        //     id: memberId,
        //     gymId: gymId,
        //     name: values.name,
        //     email: values.email,
        //     startedOn: member?.startedOn,
        //     address: {
        //       street: values.address.street,
        //       city: values.address.city,
        //       state: values.address.state,
        //       zip: values.address.zip,
        //     },
        //   }),
        // });

        // if (!res.ok) {
        //   throw new Error("Failed to update member.");
        // }
        console.log("Updated");

        setOpenDialog(false);
      } catch (error) {
        console.error(error);
      } finally {
        setUpdating(false);
      }
    },
  });
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      <IconButton
        aria-label='delete'
        color='info'
        onClick={() => setOpenDialog(true)}
      >
        <Edit />
      </IconButton>
      <Dialog open={openDialog}>
        <DialogTitle>Edit Member </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin='normal'
              label='Name'
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Email'
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Street Address'
              name='address.street'
              value={formik.values.address.street}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin='normal'
              label='City'
              name='address.city'
              value={formik.values.address.city}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin='normal'
              label='State'
              name='address.state'
              value={formik.values.address.state}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Zip Code'
              name='address.zip'
              value={formik.values.address.zip}
              onChange={formik.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              variant='contained'
              style={{ color: "secondary" }}
            >
              Cancel
            </Button>

            <Button type='submit' variant='contained'>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
export default UpdateMemberForm;
