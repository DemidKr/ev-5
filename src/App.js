import {
  Box,
  Grid,
} from "@mui/material";
import React, {useState} from "react";

function App() {


  const rand = () => {

  }

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
      >
        <Grid item lg={12} sx={{mb: 2}}>

        </Grid>
      </Box>
  );
}

export default App;
