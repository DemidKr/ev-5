import {
    Box, Button,
    Grid, Input, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import React, {useState} from "react";

function App() {
    // Кол-во особей
    const [chromosomeNumber, setChromosomeNumber] = useState('')
    // Кол-во повторений
    const [repeatsNumber, setRepeatsNumber] = useState('')
    // Кол-во задач
    const [tasksNumber, setTasksNumber] = useState('')
    // Кол-во процессоров
    const [processesNumber, setProcessesNumber] = useState('')
    // Шанс мутации
    const [mutationChance, setMutationChance] = useState(50)
    // Шанс кроссовера
    const [crossoverChance, setCrossoverChance] = useState(50)
    // Диапозон чисел генерации задач
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')

    const [initialMatrix, setInitialMatrix] = useState([])
    const [chromosomeMatrix, setChromosomeMatrix] = useState([])

    const [blockInputs, setBlockInputs] = useState(false)


  const rand = (min, max) => {
      return Math.floor(Math.random() * (max - min) ) + min;
  }

  const generateMatrix = () => {
      setInitialMatrix([])
      const tempArr = Array.from({length: tasksNumber}, () => rand(from, to));
      setInitialMatrix(tempArr)
    }

    const geneticAlgorithm = () => {

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
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="Введите кол-во процессоров"
                  placeholder={processesNumber.toString()}
                  onChange={(e) => setProcessesNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="Введите кол-во задач"
                  placeholder={tasksNumber.toString()}
                  onChange={(e) => setTasksNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="От"
                  placeholder={from.toString()}
                  onChange={(e) => setFrom(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="До"
                  placeholder={to.toString()}
                  onChange={(e) => setTo(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="Кол-во особей"
                  placeholder={chromosomeNumber.toString()}
                  onChange={(e) => setChromosomeNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  label="Кол-во повторений для лучшей особи"
                  placeholder={repeatsNumber.toString()}
                  onChange={(e) => setRepeatsNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <Box sx={{ width: 450 }}>
                  <Typography id="input-slider" gutterBottom>
                      Шанс кроссовера
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                          <Slider
                              value={typeof crossoverChance === 'number' ? crossoverChance : parseInt(crossoverChance)}
                              onChange={(e) => setCrossoverChance(e.target.value)}
                              aria-labelledby="input-slider"
                          />
                      </Grid>
                      <Grid item>
                          <Input
                              value={crossoverChance}
                              size="small"
                              onChange={(e) => setCrossoverChance(e.target.value)}
                              inputProps={{
                                  step: 1,
                                  min: 0,
                                  max: 100,
                                  type: 'number',
                                  'aria-labelledby': 'input-slider',
                              }}
                          />
                      </Grid>
                  </Grid>
              </Box>
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <Box sx={{ width: 450 }}>
                  <Typography id="input-slider" gutterBottom>
                      Шанс мутации
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                          <Slider
                              value={typeof mutationChance === 'number' ? mutationChance : parseInt(mutationChance)}
                              onChange={(e) => setMutationChance(e.target.value)}
                              aria-labelledby="input-slider"
                          />
                      </Grid>
                      <Grid item>
                          <Input
                              value={mutationChance}
                              size="small"
                              onChange={(e) => setMutationChance(e.target.value)}
                              inputProps={{
                                  step: 1,
                                  min: 0,
                                  max: 100,
                                  type: 'number',
                                  'aria-labelledby': 'input-slider',
                              }}
                          />
                      </Grid>
                  </Grid>
              </Box>
          </Grid>
          <Grid item lg={12} sx={{mb: 2}}>
              <Button variant="contained" onClick={generateMatrix}>Сгенерировать матрицу задач</Button>
          </Grid>
          <Grid item lg={12} sx={{mb: 2}}>
              {initialMatrix.length !== 0 &&
                  <Grid item xs={6} sx={{
                      mb: 2
                  }}>
                      <Typography id="input-slider" gutterBottom>
                          Матрица задач
                      </Typography>
                      <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableBody>
                                  {initialMatrix.map((el, index) => (
                                      <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                          {[...Array(processesNumber)].map((e, i) => (
                                              <TableCell scope="row" key={i}>
                                                  {el}
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </Grid>}
          </Grid>
          {initialMatrix.length !== 0 &&
              <Grid item lg={12} sx={{mb: 2}}>
                  <Button variant="contained" onClick={geneticAlgorithm}>Продолжить</Button>
              </Grid>}
          <Grid item lg={12} sx={{mb: 2}}>

          </Grid>
      </Box>
  );
}

export default App;
