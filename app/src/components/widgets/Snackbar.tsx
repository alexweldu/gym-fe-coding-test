import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";

interface CustomSnackbarProps {
  open: boolean;
  severity: "error" | "warning" | "info" | "success";
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = (
  props: CustomSnackbarProps
) => {
  const [open, setOpen] = React.useState(props.open);
  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={props.autoHideDuration ?? 6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={props.severity}
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
