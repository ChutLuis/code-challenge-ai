import {
  Navbar,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import React from "react";
import newLogo from "../../assets/new-logo.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetToken } from "../../redux/userReducer";
const NavbarDefault = () => {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const handleLogout = (e: any) => {
    e.preventDefault();
    dispatch(resetToken());
    navigate("/login");
  };

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <img
          src={newLogo}
          className="w-24 h-24 cursor-pointer"
          alt="metalworklogo"
          onClick={() => navigate("/")}
        />
        <div className="hidden lg:block">
          {" "}
          <Button onClick={handleLogout}>LogOut</Button>
        </div>

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          <Button onClick={handleLogout}>LogOut</Button>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavbarDefault;
