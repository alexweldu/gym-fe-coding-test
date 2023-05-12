"use client";
import {
  ExitToApp,
  Home,
  Logout,
  PeopleAlt,
  Settings,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import styles from "./SideMenu.module.scss";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MenuListIcon = [
  <Home key={0} />,
  <PeopleAlt key={1} />,
  <Settings key={2} />,
];
const SideMenu = (token: any) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (text: string) => {
    setOpen(false);
  };
  const handleGym = () => {
    router.push("/dashboard/gym");
    setOpen(false);
  };
  const handleSettings = () => {
    router.push("/dashboard/settings");
    setOpen(false);
  };
  const handleMembers = () => {
    router.push("/dashboard/members");
    setOpen(false);
  };
  const handleProfile = () => {
    router.push("/dashboard/profile");
    setOpen(false);
  };
  const logout = () => {
    const isLoggedIn = false;

    router.push("/");
    setOpen(false);
  };
  return (
    <Box sx={{ display: "flex", marginLeft: "40px" }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Byte Kitchen
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
              sx={{ marginLeft: "auto" }}
            >
              <Avatar alt='User' src='/user.jpg' />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* <Tooltip title='Setting'>
                <IconButton>
                  <MenuItem onClick={handleMenuClose}>
                    <Settings sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                </IconButton>
              </Tooltip> */}

              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"GYM"} disablePadding sx={{ display: "block" }}>
            <Link className={styles.link} href={`/dashboard/gym`}>
              <Tooltip title='GYM'>
                <IconButton onClick={() => {}}>
                  <ListItemButton
                    onClick={() => handleGym()}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {MenuListIcon[0]}
                    </ListItemIcon>
                    <ListItemText
                      primary={"GYM"}
                      sx={{
                        color: theme.palette.text.primary,
                        opacity: open ? 1 : 0,
                      }}
                    />
                  </ListItemButton>
                </IconButton>
              </Tooltip>
            </Link>
          </ListItem>
          <ListItem key={"Members"} disablePadding sx={{ display: "block" }}>
            <Link className={styles.link} href={`/dashboard/members`}>
              <Tooltip title='Members'>
                <IconButton onClick={() => {}}>
                  <ListItemButton
                    onClick={() => handleMembers()}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {MenuListIcon[1]}
                    </ListItemIcon>
                    <ListItemText
                      primary={"Members"}
                      sx={{
                        color: theme.palette.text.primary,
                        opacity: open ? 1 : 0,
                      }}
                    />
                  </ListItemButton>
                </IconButton>
              </Tooltip>
            </Link>
          </ListItem>
          <ListItem key={"Settings"} disablePadding sx={{ display: "block" }}>
            <Link className={styles.link} href={`/dashboard/settings`}>
              <Tooltip title='Settings'>
                <IconButton onClick={() => {}}>
                  <ListItemButton
                    onClick={() => handleSettings()}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {MenuListIcon[2]}
                    </ListItemIcon>
                    <ListItemText
                      primary={"Setting"}
                      sx={{
                        color: theme.palette.text.primary,
                        opacity: open ? 1 : 0,
                      }}
                    />
                  </ListItemButton>
                </IconButton>
              </Tooltip>
            </Link>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
};
export default SideMenu;
