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
import { useEffect, useState } from "react";

type Props = {
  gymId: number;
  memberId: number;
  refresh: () => void;
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

const DeleteMemberTableRow: React.FC<Props> = ({
  gymId,
  memberId,
  refresh,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: session } = useSession();

  const [token, setToken] = useState("");
  useEffect(() => {
    if (!session?.user?.token) return;

    const token = session.user.token;
    setToken(token);
  }, [session]);
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteMember(memberId, token);
      await deleteMember(memberId, token);
      refresh();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
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
