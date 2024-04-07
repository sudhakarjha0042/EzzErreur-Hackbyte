import React, { useContext, useState } from 'react';
import mainlogo from '../../assets/mainLogo.svg';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/defaultImage.svg';
import home from '../../assets/homeSidebar.svg';
import settings from '../../assets/settingsSidebar.svg';
import navigation from '../../assets/navSidebar.svg';
import saved from '../../assets/bmSidebar.svg';
import ActiveSettings from '../../assets/blueSettings.svg';
import ActiveExplore from '../../assets/blueExplore.svg';
import ActiveHome from '../../assets/blueHome.svg';
import ActiveSaved from '../../assets/outlinedSaved.svg';
import NavbarItem from './NavItem';

 
const Sidebar = ({ user, handleSetUser, windowWidth }) => {
  const state = useLocation();
  const userData = JSON.parse(localStorage.getItem('user'));

  //   console.log(auth);
  const menuItem = [
    {
      name: 'Home',
      link: `/home`,
      icon: home,
      activeIcon: ActiveHome,
    },
    {
      name: 'Explore',
      link: '/explore',
      icon: navigation,
      activeIcon: ActiveExplore,
    },
    // {
    //   name: 'Saved Collection',
    //   link: '/saved',
    //   icon: saved,
    //   activeIcon: ActiveSaved,
    // },
    {
      name: 'Settings',
      link: '/settings',
      icon: settings,
      activeIcon: ActiveSettings,
    },
  ];


  return (
    <aside
      className={` bg-black border-r text-gray-100 border-slate-700
        w-80 overflow-y-hidden scrollbar-hidden no-scrollbar`}
    >
      <div
        className={`flex flex-col top-0 items-center justify-between w-full `}
      >
        {/* Profile Info */}
        <div className="flex flex-col gap-8">
          <Link
            to="/home"
            className="inline-flex rounded-md bg-gray-900 hover:bg-cyan-950 hover:scale-[1.03] items-center border-transparent justify-center w-fit mx-7 px-3 my-4 "
          >
            <img
              src={mainlogo}
              alt=""
              className="h-12 mx-1"
            /> <h1 className='text-xl' >Ezz Erreur</h1>
          </Link>
          <div
            className={`w-full p-2 rounded-md  border-gray-700 hover:scale-105 transition-all duration-100 hover:border-cyan-400 border-2 `}
          >
            <div className=" h-[100px] w-[100px] mx-auto mb-2 overflow-hidden">
              <img
                src={defaultImage}
                className="object-cover w-full h-full rounded-full"
                alt=""
              />
            </div>
            <p
              className={`font-bold text-center text-[16px]`}
            >
              {userData.firstName} {userData.lastName}
            </p>

            <div
              className={`flex flex-col justify-between items-center text-base font-normal gap-2 pt-8`}
            >
              <div className="flex flex-row justify-between items-center w-full text-xs">
                <p>Code Saved</p>
                <p className="ml-1">8</p>
              </div>
              <div className="flex flex-row justify-between items-center w-full text-xs">
                <p>Likes</p>
                <p className="ml-1">0</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col items-start justify-start gap-4">
            {menuItem.map(({ name, link, icon, activeIcon }) => (
              <NavbarItem
                name={name}
                link={link}
                icon={icon}
                isActive={link === state.pathname}
                key={name}
                activeIcon={activeIcon}
                
              />
            ))}
            {/* Temorary until setting page come */}
            {/* <p className={` relative flex flex-row items-center justify-start w-full gap-3 px-2 py-3 rounded-md cursor-pointer border-1 text-base ${selectedMode === "dark" ? "text-[#B3B3B3] hover:text-primary-500 hover:bg-dark-border" : "text-[#636363] hover:bg-primary-50 hover:text-primary-500"}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {
                isHovered ?
                  <img src={ActiveSettings} />
                  :
                  <img src={settings} />
              }
              <span>Settings</span>
              {isHovered && <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-4 right-0 z-10 w-[113px] bg-primary-500 rounded-xl rounded-bl-none  flex flex-col justify-center shadow-md`}
              >
                <p
                  className="px-4 py-2 text-xs font-medium text-center text-white ">
                  Coming Soon
                </p>
              </motion.div>}
            </p> */}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;