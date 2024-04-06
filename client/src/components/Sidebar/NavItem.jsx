import React from 'react';
import { NavLink } from 'react-router-dom';
const NavbarItem = ({
  name,
  link,
  isActive,
  icon,
  activeIcon,
}) => {
  return (
    <NavLink
      key={link}
      to={link}
      className={`flex flex-row items-center justify-start w-full gap-3 group px-2 py-3 rounded-md cursor-pointer border-1 text-base ${
        isActive
            ? 'bg-cyan-400 bg-opacity-90 text-gray-800'
            : 'text-[#B3B3B3] hover:text-gray-700 hover:bg-cyan-600'
         
      }`}
    >
      {/* showing blue icon on hover */}
      <img
        src={isActive ? activeIcon : icon}
        className="block group-hover:hidden w-[17px] h-[17px]"
      />

      <img
        src={activeIcon}
        className="hidden group-hover:block w-[17px] h-[17px]"
      />
      <span>{name}</span>
    </NavLink>
  );
};

export default NavbarItem;