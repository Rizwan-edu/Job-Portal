import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function Nav() {
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-[#0065F8]">
        <Link to="/Home">
        <div className="text-3xl font-bold text-amber-50 ">
          JOB PORTAL
        </div>
        </Link>
        <div>
          {/* Wrap the Button with Link and set the 'to' prop */}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button style={{ color: 'white' }}>
              Login
            </Button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button style={{ textDecoration: 'none', color: 'white' }}>
            Signup
          </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Nav;