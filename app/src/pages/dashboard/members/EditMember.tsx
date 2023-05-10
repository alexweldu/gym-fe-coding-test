import CustomSnackbar from "@/components/widgets/Snackbar";
import { getMembers, updateMember } from "@/services/api";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Formik, useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
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
}

const UpdateMemberFormWith: React.FC<Props> = ({ member }) => {
  const { query } = useRouter();
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    onSubmit: async (values) => {
      try {
        if (!session?.user?.token) return;

        const token = session.user.token;
        const res = await updateMember("memberId", "gymId", values, token);

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
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
  });

  const handleGoBack = () => {};

  return (
    <div>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", maxWidth: 700, pb: 2 }}>
          <Typography variant='h4'> Edit Memeber</Typography>
          <Formik
            initialValues={{
              name: member.email ?? "",
              email: member.email ?? "",
              address: {
                street: member?.address?.street ?? "",
                city: member?.address?.city ?? "",
                state: member?.address?.state ?? "",
                zip: member?.address?.zip ?? "",
              },
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setIsSubmitting(true);
              try {
                await axios.put(`/dashboard/members/${query.id}`, {
                  ...values,
                });
                mutate(`/dashboard/members?id=${member.id}`);
                resetForm();
              } catch (error) {
                console.error(error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
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

            <Button
              onClick={() => handleGoBack()}
              variant='contained'
              style={{ color: "secondary" }}
            >
              Cancel
            </Button>

            <Button type='submit' variant='contained'>
              Update
            </Button>
          </Formik>
        </Box>
      </Box>
    </div>
  );
};
export default UpdateMemberFormWith;
