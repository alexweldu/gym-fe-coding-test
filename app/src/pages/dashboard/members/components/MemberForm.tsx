import CustomSnackbar from "@/components/widgets/Snackbar";
import { createMembers } from "@/services/api";
import { Add, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
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
const MemberForm = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={AddMemberSchema}
        onSubmit={async (values) => {
          if (!session?.user?.token) return;
          const token = session.user.token;
          const response = await createMembers(values, token);
          console.log("Submite:", response);
          if (response) {
            <CustomSnackbar
              message='Successfully Created'
              severity='success'
              open={open}
              onClose={() => setOpen(false)}
              autoHideDuration={600}
            />;
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
                    formik.touched.address?.city && formik.errors.address?.city
                  }
                  error={
                    formik.touched.address?.city && formik.errors.address?.city
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
                    formik.touched.address?.zip && formik.errors.address?.zip
                  }
                  error={
                    formik.touched.address?.zip && formik.errors.address?.zip
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
    </>
  );
};

export default MemberForm;
