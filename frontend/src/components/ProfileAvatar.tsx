import { Avatar, ClickAwayListener } from "@mui/material";
import React, { useRef, useState } from "react";
import { colors } from "../constants";
import { getInitials } from "../utils";
import { useAuth } from "../context/authContext";
import ProfileTab from "./ProfileTab";

type Props = {};

const ProfileAvatar = (props: Props) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (popperRef.current && popperRef.current.contains(event.target as Node)) {
      return;
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Avatar
          sx={{
            width: "40px",
            height: "40px",
            fontSize: "16px",
            fontWeight: 500,
            backgroundColor: colors.primary,
            color: colors.white,
            cursor: "pointer",
          }}
          onClick={handleAvatarClick}
        >
          {getInitials(user?.username)}
        </Avatar>
        <ProfileTab
          open={open}
          anchorEl={anchorEl}
          popperRef={popperRef}
          handleClose={handleClose}
        />
      </div>
    </ClickAwayListener>
  );
};

export default ProfileAvatar;
