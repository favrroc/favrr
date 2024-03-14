import React, { useMemo, useState } from "react";

import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { formatUserDisplay } from "../../../core/util/string.util";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import MobileUserMenu from "../../header/children/mobile-user-menu/MobileUserMenu";
import "./user-thumb.scss";

interface Props {
  address: string;
  displayLastCharacters?: boolean;
  mobileView?: boolean | undefined;
}

const UserThumb = ({ displayLastCharacters, address, mobileView }: Props) => {
  const { profile } = useAppSelector((state) => state.user);

  const [displayMenu, setDisplayMenu] = useState(false);

  const displayName = useMemo(() => {
    return displayLastCharacters
      ? formatUserDisplay(address, profile?.fullName as string)
      : profile?.fullName || address?.toUpperCase();
  }, [address, profile, displayLastCharacters]);

  const handleClickUserThumb = (e: any) => {
    if (displayMenu) {
      e.stopPropagation();
      e.preventDefault();
    }

    //This slight async delay allows for the click to propagante before the useClickOutside listener is added
    setTimeout(() => {
      if (!mobileView) {
        setDisplayMenu(!displayMenu);
      }
    }, 0);
  };

  return (
    <div className="user-thumb">
      <button className="thumb-button" onClick={handleClickUserThumb}>
        <img
          className="profile-image"
          width={32}
          height={32}
          src={profile?.profileImageUrl || OceanaCoinImage().props.src}
        />
        <span className="username">{displayName}</span>
      </button>
      {displayMenu && (
        <MobileUserMenu
          hideNotifications
          onClose={() => setDisplayMenu(false)}
        />
      )}
    </div>
  );
};

export default UserThumb;
