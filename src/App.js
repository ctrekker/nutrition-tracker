import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import NutritionTable from './NutritionTable';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import Config from './Config';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

function App() {
  const [ foods, setFoods ] = useState([]);
  const [ nutrients, setNutrients ] = useState([]);
  const [ nutrientValues, setNutrientValues ] = useState([]);
  const [ foodEntries, setFoodEntries ] = useState([]);
  
  const [ refetchFoods, setRefetchFoods ] = useState(false);
  const [ refetchNutrientValues, setRefetchNutrientValues ] = useState(false);
  const [ refetchFoodEntries, setRefetchFoodEntries ] = useState(false);
  
  const [ createFoodOpen, setCreateFoodOpen ] = useState(false);
  
  const newFoodNameRef = useRef();
  const newFoodNutrientsRef = useRef({});
  
  useEffect(() => {
    const fetchFoods = async () => {
      const foodReq = await axios.get(Config.backendEndpoint('/foods'));
      setFoods(foodReq.data);
    }
    fetchFoods().catch(console.log);
  }, [refetchFoods]);
  useEffect(() => {
    const fetchNutrients = async () => {
      const nutrientsReq = await axios.get(Config.backendEndpoint('/nutrients'));
      setNutrients(nutrientsReq.data);
    }
    fetchNutrients().catch(console.log);
  }, []);
  useEffect(() => {
    const fetchNutrientValues = async () => {
      const nutrientValuesReq = await axios.get(Config.backendEndpoint('/foods/nutrients'));
      setNutrientValues(nutrientValuesReq.data);
    }
    fetchNutrientValues().catch(console.log);
  }, [refetchNutrientValues]);
  useEffect(() => {
    const fetchFoodEntries = async () => {
      const foodEntriesReq = await axios.get(Config.backendEndpoint('/foods/entries'));
      setFoodEntries(foodEntriesReq.data);
    }
    fetchFoodEntries().catch(console.log);
  }, [refetchFoodEntries]);
  
  function handleFoodClick(foodId) {
    return async e => {
      await axios.post(Config.backendEndpoint('/foods/entries'), { foodId });
      setRefetchFoodEntries(!refetchFoodEntries);
    };
  }
  function handleFoodRemoveClick(foodId) {
    return async e => {
      const foodEntryTarget = foodEntries.reverse().find(x => x.food_id === foodId);
      if(foodEntryTarget) {
        console.log(foodEntryTarget);
        const foodEntryId = foodEntryTarget.food_entry_id;
        console.log(foodEntryId);
        await axios.delete(Config.backendEndpoint(`/foods/entries/${foodEntryId}`));
        setRefetchFoodEntries(!refetchFoodEntries);
      }
    };
  }
  function handleFoodCreateClick(e) {
    setCreateFoodOpen(true);
  }
  function handleFoodCreateClose() {
    setCreateFoodOpen(false);
  }
  function handleFoodDeleteClick(e) {
  
  }
  function handleFoodDeleteClose(e) {
  
  }
  function handleNutrientCreateClick(e) {
  
  }
  function handleNutrientCreateClose() {
  
  }
  async function handleFoodCreate()  {
    const foodName = newFoodNameRef.current.value;
    console.log(foodName);
    await axios.post(Config.backendEndpoint('/foods'), {
      name: foodName
    });
    const foodValuesRes = await axios.get(Config.backendEndpoint('/foods/'));
    const foodId = foodValuesRes.data.find(x => x.name === foodName).food_id;
    
    const nutrientValues = Object.entries(newFoodNutrientsRef.current).map(x => [x[0], x[1].value]);
    console.log(nutrientValues);
    console.log(foodId);
    for(let [nutrientId, nutrientValue] of nutrientValues) {
      console.log(nutrientId);
      await axios.post(Config.backendEndpoint('/foods/nutrients'), {
        foodId,
        nutrientId,
        value: nutrientValue
      });
    }
    
    setRefetchFoods(!refetchFoods);
    setRefetchNutrientValues(!refetchNutrientValues);
    
    handleFoodCreateClose();
  }
  
  console.log('-----------')
  console.log(foods);
  console.log(nutrients);
  console.log(nutrientValues);
  console.log(foodEntries);
  
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.container, styles.leftContainer)}>
        <Typography variant={'h5'} gutterBottom>Today's Nutrition Table</Typography>
        <NutritionTable
          foods={foods}
          nutrients={nutrients}
          nutrientValues={nutrientValues}
          foodEntries={foodEntries}
          
          onFoodClick={handleFoodClick}
          onFoodRemoveClick={handleFoodRemoveClick}
        />
      </div>
      <div className={css(styles.container, styles.rightContainer)}>
        <Paper elevation={2} className={css(styles.actionsPaper)}>
          <Typography variant={'h5'} gutterBottom>Actions</Typography>
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleFoodCreateClick}>Create a new food</Button>
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleFoodDeleteClick}>Delete a food</Button>
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleNutrientCreateClick}>Create a new nutrition variable</Button>
        </Paper>
      </div>
      {/*<div className={css(styles.container, styles.rightContainer)}>*/}
      {/*  <FoodsGrid foods={foods} onFoodClick={handleFoodClick} onCreateFoodClick={handleFoodCreateClick}/>*/}
      {/*</div>*/}
      <Dialog open={createFoodOpen} onClose={handleFoodCreateClose}>
        <DialogTitle>Create a new food item</DialogTitle>
        <DialogContent>
          <TextField inputRef={newFoodNameRef} variant={'outlined'} label={'Name of food'} fullWidth/>
          <div className={css(styles.nutritionalValuesColumnContainer)}>
            <Typography variant={'subtitle1'}>Nutritional Values</Typography>
            <div className={css(styles.nutritionalValuesColumn)}>
              {
                nutrients.map((nutrient, nutrientKey) => (
                  <TextField key={nutrientKey} inputRef={el => newFoodNutrientsRef.current[nutrient.nutrient_id] = el} size={'small'} variant={'outlined'} label={nutrient.name} style={{ marginBottom: '4px' }}/>
                ))
              }
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFoodCreateClose} variant={'contained'}>
            Cancel
          </Button>
          <Button onClick={handleFoodCreate} variant={'contained'} color={'primary'}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f9f9f9'
  },
  container: {
    padding: '20px'
  },
  leftContainer: {
    borderRight: '1px solid #dadada'
  },
  rightContainer: {
    flexGrow: 1
  },
  actionsPaper: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  },
  actionsButton: {
    marginBottom: '10px'
  },
  nutritionalValuesColumnContainer: {
    marginTop: '15px'
  },
  nutritionalValuesColumn: {
    display: 'flex',
    flexDirection: 'column'
  }
});

export default App;
