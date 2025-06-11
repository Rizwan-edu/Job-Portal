import { Button, TextField } from '@mui/material'
import React from 'react'

function Signup() {
  return (
    <>
    <div className='flex items-start justify-center py-12'>
    <div className='max-w-md w-screen border bg-amber-50 border-amber-950 rounded-2xl shadow-xl p-8 space-y-8'>
      <h2 className="text-center text-2xl font-bold text-[#30136e]">Sign up</h2>
      <form className='grid gap-5'>
        <div className="text-2xl font-medium">Email</div>
        <TextField
          label="Enter your Email"
          variant="outlined"    
          fullWidth
          required
        />
        <div className="text-2xl font-medium">Password</div>
        <TextField
          label="Enter your new password"
          variant="outlined"
          fullWidth
          required
        />
        <div>
        <TextField
          label="Re-Enter your Password"
          variant="outlined"
          fullWidth
          required
        />
        </div>
        <div>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#333',
            '&:hover': { backgroundColor: '#555' }
          }}
        >
          Submit
        </Button>
        </div>
      </form>
    </div> 
    </div> 
    </>
  )
}

export default Signup