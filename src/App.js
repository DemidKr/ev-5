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
    const [initialChromosomeMatrix, setInitialChromosomeMatrix] = useState([])
    const [finalChromosomeMatrix, setFinalChromosomeMatrix] = useState([])


    const [blockInputs, setBlockInputs] = useState(false)

    Array.prototype.hasMin = function(attrib) {
        return (this.length && this.reduce(function(prev, curr){
            return prev[attrib] < curr[attrib] ? prev : curr;
        })) || null;
    }

  const rand = (min, max) => {
      return Math.floor(Math.random() * (max - min) ) + min;
  }

  const generateMatrix = () => {
      setInitialMatrix([])
      const tempArr = Array.from({length: tasksNumber}, () => rand(from, to));
      setInitialMatrix(tempArr)
    }

    const parseArray = arr => {
        return arr.reduce((acc, val) => {
            return (acc << 1) | val;
        });
    };

    const findMaximum = (child) => {
        let sortArr = Array.from({length: 4}, () => []);
        for(let j = 0; j < tasksNumber; j++) {
            let index = Math.floor(child.bytes[j]/64)
            sortArr[index].push(child.tasks[j])
        }
        const sumArr = sortArr.map(arr => arr.reduce((partialSum, a) => partialSum + a, 0))
        console.log("sumArr", sumArr)
        let maximum = Math.max(...sumArr);
        return maximum
    }

    const generateInitialChromosome = () => {
        setBlockInputs(true)
        const tempArr = Array.from({length: chromosomeNumber}, () => {
            return {
                tasks: initialMatrix,
                bytes: Array.from({length: tasksNumber}, () => rand(0, 255)),
                max: undefined
            }
        } );
        console.log("tempArr", tempArr)
        for (let i = 0; i < chromosomeNumber; i++) {
            let sortArr = Array.from({length: 4}, () => []);
            for(let j = 0; j < tasksNumber; j++) {
                let index = Math.floor(tempArr[i].bytes[j]/64)
                sortArr[index].push(tempArr[i].tasks[j])
            }
            console.log("sortArr", sortArr)
            const sumArr = sortArr.map(arr => arr.reduce((partialSum, a) => partialSum + a, 0))
            console.log("sumArr", sumArr)
            let maximum = Math.max(...sumArr);
            console.log("maximum", maximum)
            tempArr[i].max = maximum
        }
        console.log("tempArr", tempArr)
        setInitialChromosomeMatrix(tempArr)
    }

    const geneticAlgorithm = () => {
        let logs = [initialChromosomeMatrix]
        let finalArr = initialChromosomeMatrix
        let count = 0
        let bestChromosome = finalArr.hasMin('max').max
        console.log("bestChromosome", bestChromosome)

        while (count < repeatsNumber) {
            const isMutation = rand(0, 100) < mutationChance ? true : false
            const isCrossover = rand(0, 100) < crossoverChance ? true : false
            console.log("isMutation", isMutation)
            console.log("isCrossover", isCrossover)
            if (!isMutation && !isCrossover) {
                console.log("SKIP")
                count++
            } else {
                const firstChildIndex = rand(0, chromosomeNumber - 1)
                console.log("firstChildIndex", firstChildIndex)
                let secondChildIndex = rand(0, chromosomeNumber - 1)
                while (firstChildIndex === secondChildIndex) {
                    secondChildIndex = rand(0, chromosomeNumber - 1)
                }
                console.log("secondChildIndex", secondChildIndex)
                let firstChild = {
                    tasks: [...finalArr[firstChildIndex].tasks],
                    bytes: [...finalArr[firstChildIndex].bytes],
                    max: finalArr[firstChildIndex].max
                }
                let secondChild = {
                    tasks: [...finalArr[secondChildIndex].tasks],
                    bytes: [...finalArr[secondChildIndex].bytes],
                    max: finalArr[secondChildIndex].max
                }
                console.log("firstChild before", firstChild.bytes.toString())
                console.log("secondChild before", secondChild.bytes.toString())
                if (isCrossover) {
                    const crossoverNumber = rand(0, tasksNumber-1)
                    console.log("crossoverNumber", crossoverNumber)
                    for (let i = crossoverNumber; i < tasksNumber; i++) {
                        let temp = firstChild.bytes[i]
                        firstChild.bytes[i] = secondChild.bytes[i]
                        secondChild.bytes[i] = temp
                    }
                    console.log("firstChild cross", firstChild.bytes.toString())
                    console.log("secondChild cross", secondChild.bytes.toString())
                }
                if (isMutation && isCrossover) {
                    const firstIndex = rand(0, chromosomeNumber - 1)
                    console.log("firstIndex", firstIndex)
                    const secondIndex = rand(0, chromosomeNumber - 1)
                    console.log("secondIndex", secondIndex)
                    let firstBinary = [...Array(8)].map((x,i) => firstChild.bytes[firstIndex]>>i&1).reverse()
                    console.log("firstChild.bytes[firstIndex]", firstChild.bytes[firstIndex])
                    console.log("firstBinary", firstBinary)

                    let randIndex = rand(0, 7)
                    firstBinary[randIndex] === 0 ? firstBinary[randIndex] = 1 : firstBinary[randIndex] = 0
                    console.log("parseArray(firstBinary)", parseArray(firstBinary))
                    firstChild.bytes[firstIndex] = parseArray(firstBinary)

                    let secondBinary = [...Array(8)].map((x,i) => secondChild.bytes[secondIndex]>>i&1).reverse()
                    console.log("secondChild.bytes[secondIndex]", secondChild.bytes[secondIndex])
                    console.log("secondBinary", secondBinary)

                    randIndex = rand(0, 7)
                    secondBinary[randIndex] === 0 ? secondBinary[randIndex] = 1 : secondBinary[randIndex] = 0
                    console.log("parseArray(secondBinary)", parseArray(secondBinary))
                    secondChild.bytes[secondIndex] = parseArray(secondBinary)

                    console.log("firstChild mut", firstChild.bytes.toString())
                    console.log("secondChild mut", secondChild.bytes.toString())
                }
                if (isMutation && !isCrossover) {
                    const firstIndex = rand(0, chromosomeNumber - 1)
                    console.log("firstIndex", firstIndex)
                    let firstBinary = [...Array(8)].map((x,i) => firstChild.bytes[firstIndex]>>i&1).reverse()
                    console.log("firstChild.bytes[firstIndex]", firstChild.bytes[firstIndex])
                    console.log("firstBinary", firstBinary)

                    let randIndex = rand(0, 7)
                    firstBinary[randIndex] === 0 ? firstBinary[randIndex] = 1 : firstBinary[randIndex] = 0
                    console.log("parseArray(firstBinary)", parseArray(firstBinary))
                    firstChild.bytes[firstIndex] = parseArray(firstBinary)

                    console.log("firstChild mut", firstChild.bytes.toString())
                    finalArr[firstChildIndex] = firstChild
                }

                console.log("findMaximum(firstChild)", findMaximum(firstChild))
                firstChild.max = findMaximum(firstChild)
                console.log("findMaximum(secondChild)", findMaximum(secondChild))
                secondChild.max = findMaximum(secondChild)
                let betterChild = firstChild.max < secondChild.max ? firstChild : secondChild

                if (betterChild.max < finalArr[firstChildIndex].max) {
                    console.log("Better")
                    console.log("finalArr[firstChildIndex]", finalArr[firstChildIndex].bytes.toString())
                    finalArr[firstChildIndex] = betterChild
                    console.log("finalArr[firstChildIndex]", finalArr[firstChildIndex].bytes.toString())
                    console.log("finalArr.hasMin('max').max", finalArr.hasMin('max').max)

                    if(finalArr.hasMin('max').max < bestChromosome) {
                        console.log("count", count)
                        bestChromosome = finalArr.hasMin('max').max
                        count = 1
                    } else {
                        count++
                    }
                } else {
                    console.log("Not better")
                    count++
                }
            }
            let log = []
            for( let i = 0; i < finalArr.length; i++) {
                log.push({
                    tasks: finalArr[i].tasks.toString(),
                    bytes: finalArr[i].bytes.toString(),
                    max: finalArr[i].max.toString(),
                    count: count
                })
            }
            logs.push(log)
        }
        setFinalChromosomeMatrix(finalArr)
        console.log("logs", logs)
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
                  disabled={blockInputs}
                  label="Введите кол-во процессоров"
                  placeholder={processesNumber.toString()}
                  onChange={(e) => setProcessesNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  disabled={blockInputs}

                  label="Введите кол-во задач"
                  placeholder={tasksNumber.toString()}
                  onChange={(e) => setTasksNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  disabled={blockInputs}

                  label="От"
                  placeholder={from.toString()}
                  onChange={(e) => setFrom(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  disabled={blockInputs}

                  label="До"
                  placeholder={to.toString()}
                  onChange={(e) => setTo(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  disabled={blockInputs}
                  label="Кол-во особей"
                  placeholder={chromosomeNumber.toString()}
                  onChange={(e) => setChromosomeNumber(parseInt(e.target.value))}
              />
          </Grid>
          <Grid item lg={12} sx={{mb: 2, minWidth: 450}}>
              <TextField
                  id="outlined"
                  fullWidth={true}
                  disabled={blockInputs}
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
                              disabled={blockInputs}
                              aria-labelledby="input-slider"
                          />
                      </Grid>
                      <Grid item>
                          <Input
                              value={crossoverChance}
                              size="small"
                              disabled={blockInputs}
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
                              disabled={blockInputs}
                              onChange={(e) => setMutationChance(e.target.value)}
                              aria-labelledby="input-slider"
                          />
                      </Grid>
                      <Grid item>
                          <Input
                              value={mutationChance}
                              size="small"
                              disabled={blockInputs}
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
              <Button
                  variant="contained"
                  disabled={blockInputs}
                  onClick={generateMatrix}
              >
                  Сгенерировать матрицу задач
              </Button>
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
                  <Button variant="contained" onClick={generateInitialChromosome}>Продолжить</Button>
              </Grid>}
          {initialChromosomeMatrix.length !== 0 &&
              <Grid item lg={12} sx={{mb: 2}}>
                  <Grid item xs={6} sx={{
                      mb: 2
                  }}>
                      <Typography id="input-slider" gutterBottom>
                          Начальная популяция
                      </Typography>
                      <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                  <TableRow
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                      {[...Array(chromosomeNumber)].map((el, index) => (
                                          <TableCell scope="row" key={index}>
                                              U{index+1}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {[...Array(tasksNumber)].map((el, index) => (
                                      <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                          {[...Array(chromosomeNumber)].map((e, i) => (
                                              <TableCell scope="row" key={i}>
                                                  {initialChromosomeMatrix[i].tasks[index]} - {initialChromosomeMatrix[i].bytes[index]}
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))}
                                  <TableRow>
                                      {[...Array(chromosomeNumber)].map((e, i) => (
                                          <TableCell scope="row" key={i}>
                                              =
                                          </TableCell>
                                      ))}
                                  </TableRow>
                                  <TableRow>
                                      {[...Array(chromosomeNumber)].map((e, i) => (
                                          <TableCell scope="row" key={i}>
                                              {initialChromosomeMatrix[i].max}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </Grid>
              </Grid>}
          {initialChromosomeMatrix.length !== 0 &&
              <Grid item lg={12} sx={{mb: 2}}>
                  <Button variant="contained" onClick={geneticAlgorithm}>Продолжить</Button>
              </Grid>}
          {finalChromosomeMatrix.length !== 0 &&
              <Grid item lg={12} sx={{mb: 2}}>
                  <Grid item xs={6} sx={{
                      mb: 2
                  }}>
                      <Typography id="input-slider" gutterBottom>
                          Финальная популяция
                      </Typography>
                      <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                      <TableRow
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                          {[...Array(chromosomeNumber)].map((el, index) => (
                                                    <TableCell scope="row" key={index}>
                                                        U{index+1}
                                                    </TableCell>
                                          ))}
                                      </TableRow>
                              </TableHead>
                              <TableBody>
                                  {[...Array(tasksNumber)].map((el, index) => (
                                      <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                          {[...Array(chromosomeNumber)].map((e, i) => (
                                              <TableCell scope="row" key={i}>
                                                  {finalChromosomeMatrix[i].tasks[index]} - {finalChromosomeMatrix[i].bytes[index]}
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))}
                                  <TableRow>
                                      {[...Array(chromosomeNumber)].map((e, i) => (
                                          <TableCell scope="row" key={i}>
                                              =
                                          </TableCell>
                                      ))}
                                  </TableRow>
                                  <TableRow>
                                      {[...Array(chromosomeNumber)].map((e, i) => (
                                          <TableCell scope="row" key={i}>
                                              {finalChromosomeMatrix[i].max}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </Grid>
              </Grid>}
      </Box>
  );
}

export default App;
