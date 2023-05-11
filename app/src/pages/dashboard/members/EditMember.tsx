import CustomSnackbar from "@/components/widgets/Snackbar";
import { getMembers, updateMember } from "@/services/api";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Form, Formik, useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import * as Yup from "yup";
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
  member: GymMember;
  refresh: () => void;
}

const UpdateMemberFormWith: React.FC<Props> = ({ member, refresh }) => {
  const { query } = useRouter();
  const { mutate } = useSWRConfig();
  const [token, setToken] = useState("");

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const initialValues = {
    name: member?.name,
    email: member?.email,
    street: member?.address.street,
    city: member?.address.city,
    state: member?.address.state,
    zip: member?.address.zip,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip: Yup.string().required("Zip code is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: member.email ?? "",
      email: member.email ?? "",
      address: {
        street: member?.address?.street ?? "",
        city: member?.address?.city ?? "",
        state: member?.address?.state ?? "",
        zip: member?.address?.zip ?? "",
      },
    },
    onSubmit: async (values) => {},
  });
  useEffect(() => {
    if (!session?.user?.token) return;

    const token = session.user.token;
    setToken(token);
  }, [session]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (values: any) => {
    console.log("token", token);

    try {
      const res = await updateMember(member.id, member.gymId, values, token);
      enqueueSnackbar({
        message: "Successfully Updated",
        variant: "success",
        autoHideDuration: 3000,
      });
      refresh();
      if (!res) {
        enqueueSnackbar({
          message: "Member Not updated",
          variant: "error",
          autoHideDuration: 3000,
        });
        throw new Error("Failed to update member.");
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Name'
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='Email'
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='Street Address'
                  name='street'
                  value={values.street}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='City'
                  name='city'
                  value={values.city}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='State'
                  name='state'
                  value={values.state}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  label='Zip Code'
                  name='zip'
                  value={values.zip}
                  onChange={handleChange}
                />
                <DialogActions>
                  <Button
                    onClick={() => setOpen(false)}
                    variant='contained'
                    style={{ color: "secondary" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    style={{ color: "primary" }}
                  >
                    Update
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UpdateMemberFormWith;
