import CustomSnackbar from "@/components/widgets/Snackbar";
import { deleteMember } from "@/services/api";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

type Props = {
  gymId: number;
  memberId: number;
};

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const handleDeleteConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this member?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteMemberTableRow: React.FC<Props> = ({ gymId, memberId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const { data, error, mutate } = useSWR("/members", deleteMember);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleDeleteConfirm = async () => {
    if (!session?.user?.token) return;
    const token = session.user.token;
    console.log("token s", token);
    try {
      const response = await deleteMember(memberId, token);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    mutate();
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <IconButton onClick={handleDeleteClick} color='error'>
        <Delete />
      </IconButton>
    </>
  );
};

export default DeleteMemberTableRow;
