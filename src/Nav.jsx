import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function Nav() {
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-[#030303]">
        <Link to="/Home">
        <div className="text-3xl font-bold text-amber-50 ">
          Jobsy.com
        </div>
        </Link>
        <div className='flex gap-3'>
          {/* Wrap the Button with Link and set the 'to' prop */}
          <Link to="/login" style={{ textDecoration: 'none' }}>
           <Button variant="contained" color="info">
              Login
            </Button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'Add' }}>
        <Button variant="contained" color="info">
            Signup
          </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Nav;