import React from 'react'
import { AppBar, Toolbar, Typography} from '@mui/material'


const Header = () => {
  return (
    <AppBar position='static'>
        <Toolbar>
            <Typography>Exchange App</Typography>
        </Toolbar>
    </AppBar>
  )
}

export default Header