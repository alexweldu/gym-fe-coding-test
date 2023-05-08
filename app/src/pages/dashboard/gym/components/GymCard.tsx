import {
  ExpandLess,
  ExpandMore,
  MoreHoriz,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CardHeader, Collapse, IconButton, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useState } from "react";
interface GymData {
  id: number;
  name: string;
  location: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  orgNumber: string;
  password: string;
}

type GymCardProps = {
  gymData: GymData;
};

const GymCard: React.FC<GymCardProps> = ({ gymData }) => {
  const [expanded, setExpanded] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const goTo = () => {
    router.push("/dashboard/members");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "flex-start",
      }}
    >
      <Card sx={{ width: 300 }} elevation={3}>
        <CardHeader
          title={gymData.name}
          subheader={gymData.location.street}
          action={
            <>
              <IconButton onClick={handleExpandClick}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <Tooltip title='List of Members'>
                <IconButton onClick={goTo}>
                  <MoreHoriz />
                </IconButton>
              </Tooltip>
            </>
          }
        />
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography color='text.secondary'>
              {gymData.location.city}, {gymData.location.state}{" "}
              {gymData.location.zip},
            </Typography>
            <Typography color='text.secondary'>
              Org Number: {gymData.orgNumber}
            </Typography>
            <Typography color='text.secondary'>
              Password:{" "}
              {showPassword
                ? gymData.password
                : gymData.password.replace(/./g, "*")}
              <IconButton onClick={handleShowPasswordClick}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default GymCard;
