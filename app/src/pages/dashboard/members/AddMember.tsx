import CustomSnackbar from "@/components/widgets/Snackbar";
import { createMembers } from "@/services/api";
import { Add, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";
const AddMemberSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip: Yup.string().required("Zip is required"),
  }),
});

const initialValues = {
  name: "",
  email: "",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
  },
};
const AddMember = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/dashboard/members");
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", maxWidth: 700, pb: 2 }}>
          <Formik
            initialValues={initialValues}
            validationSchema={AddMemberSchema}
            onSubmit={async (values) => {
              setIsLoading(true);
              if (!session?.user?.token) return;
              const token = session.user.token;
              try {
                const response = await createMembers(values, token);
                console.log("Submit:", response);
                setSnackbar({
                  open: true,
                  message: "Successfully created",
                  severity: "success",
                });
              } catch (error) {
                console.error("Error:", error);
                setSnackbar({
                  open: true,
                  message: "An error occurred",
                  severity: "error",
                });
              }
              setIsLoading(false);
              handleClose();
            }}
          >
            {(formik) => (
              <Form>
                <DialogTitle>Add Member</DialogTitle>
                <DialogContent>
                  <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                    <Field
                      as={TextField}
                      label='Name'
                      name='name'
                      margin='normal'
                      helperText={formik.touched.name && formik.errors.name}
                      error={formik.touched.name && formik.errors.name}
                      fullWidth
                    />
                    <Field
                      as={TextField}
                      label='Email'
                      name='email'
                      margin='normal'
                      type='email'
                      helperText={formik.touched.email && formik.errors.email}
                      error={formik.touched.email && formik.errors.email}
                      fullWidth
                    />
                    <Field
                      as={TextField}
                      label='Street'
                      margin='normal'
                      name='address.street'
                      helperText={
                        formik.touched.address?.street &&
                        formik.errors.address?.street
                      }
                      error={
                        formik.touched.address?.street &&
                        formik.errors.address?.street
                      }
                      fullWidth
                    />
                    <Field
                      as={TextField}
                      label='City'
                      name='address.city'
                      margin='normal'
                      helperText={
                        formik.touched.address?.city &&
                        formik.errors.address?.city
                      }
                      error={
                        formik.touched.address?.city &&
                        formik.errors.address?.city
                      }
                      fullWidth
                    />

                    <Field
                      as={TextField}
                      label='State'
                      name='address.state'
                      margin='normal'
                      helperText={
                        formik.touched.address?.state &&
                        formik.errors.address?.state
                      }
                      error={
                        formik.touched.address?.state &&
                        formik.errors.address?.state
                      }
                      fullWidth
                    />
                    <Field
                      as={TextField}
                      label='Zip'
                      name='address.zip'
                      margin='normal'
                      helperText={
                        formik.touched.address?.zip &&
                        formik.errors.address?.zip
                      }
                      error={
                        formik.touched.address?.zip &&
                        formik.errors.address?.zip
                      }
                      fullWidth
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleClose}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={!formik.isValid}
                    startIcon={<Add />}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
};

export default AddMember;
