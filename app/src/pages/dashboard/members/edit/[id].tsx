import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Button, DialogActions, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { getMembers, getMembersByID, updateMember } from "@/services/api";
import CustomSnackbar from "@/components/widgets/Snackbar";

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

const EditMemberPage: React.FC<Props> = () => {
  const [member, setMember] = useState<GymMember | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = router.query;
  useEffect(() => {
    // Fetch the member data using the `id` from the URL
    const fetchMember = async () => {
      if (!session?.user?.token) return;

      const token = session.user.token;
      setToken(token);
      const member = await getMembersByID(id, token);
      setMember(member);
    };

    if (id) {
      fetchMember();
    }
  }, [id, session?.user.token]);
  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(true);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (!member) {
    return <div>Loading...</div>;
  }
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

  const onSubmit = async (values: any) => {
    const memberToUpdate = {
      ...member,
      name: values.name,
      email: values.email,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
      },
    };

    const ret = await updateMember(
      memberToUpdate.id,
      memberToUpdate.gymId,
      memberToUpdate,
      token
    );
    console.log("updated Data", ret);
    if (ret?.status == 200) {
      setOpen(true);
      router.push(`/dashboard/members/`);
    } else return;
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box sx={{ width: "100%", maxWidth: 700, pb: 2 }}>
        <h1>Edit Member</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
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
                  onClick={() => router.push(`/dashboard/members`)}
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
      </Box>
      <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message='Successfully updated!'
        autoHideDuration={600}
        severity='info'
      />
    </Box>
  );
};
export default EditMemberPage;
