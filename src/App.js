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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import moment from 'moment';
import GetAppIcon from '@material-ui/icons/GetApp';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 400,
    maxWidth: 500,
  },
}));

function App() {
  const classes = useStyles();
  
  const [ foods, setFoods ] = useState([]);
  const [ nutrients, setNutrients ] = useState([]);
  const [ nutrientValues, setNutrientValues ] = useState([]);
  const [ foodEntries, setFoodEntries ] = useState([]);
  const [ foodCategories, setFoodCategories ] = useState([]);
  const [ currentDate, setCurrentDate ] = useState(moment());
  const [ actionFoodId, setActionFoodId ] = useState(null);
  const [ actionType, setActionType ] = useState(null);
  const [ foodCategory, setFoodCategory ] = useState('null');
  
  const [ refetchFoods, setRefetchFoods ] = useState(false);
  const [ refetchNutrientValues, setRefetchNutrientValues ] = useState(false);
  const [ refetchFoodEntries, setRefetchFoodEntries ] = useState(false);
  const [ refetchFoodCategories, setRefetchFoodCategories ] = useState(false);
  
  const [ createFoodOpen, setCreateFoodOpen ] = useState(false);
  const [ deleteFoodOpen, setDeleteFoodOpen ] = useState(false);
  const [ userRecoveryOpen, setUserRecoveryOpen ] = useState(false);
  
  const [ deleteFoodId, setDeleteFoodId ] = useState('');
  
  const newFoodNameRef = useRef();
  const newFoodNutrientsRef = useRef({});
  const userTokenRef = useRef();
  
  const nutrientTotals = {};
  for(let nutrient of nutrients) {
    nutrientTotals[nutrient.nutrient_id] = 0;
    for(let foodEntry of foodEntries) {
      const nutrientValueEntry = nutrientValues.find(x => x.food_id === foodEntry.food_id && x.nutrient_id === nutrient.nutrient_id);
      if(!nutrientValueEntry) continue;
      nutrientTotals[nutrient.nutrient_id] += nutrientValueEntry.value;
    }
  }
  
  useEffect(() => {
    window.addEventListener('click', handleUserRecoveryClick);
    return () => {
      window.removeEventListener('click', handleUserRecoveryClick);
    }
  }, []);
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
      const dayStart = currentDate.startOf('day').valueOf();
      const dayEnd = currentDate.endOf('day').valueOf();
      const foodEntriesReq = await axios.get(Config.backendEndpoint(`/foods/entries?start=${dayStart}&end=${dayEnd}`));
      setFoodEntries(foodEntriesReq.data);
    }
    fetchFoodEntries().catch(console.log);
  }, [refetchFoodEntries, currentDate]);
  useEffect(() => {
    const fetchFoodCategories = async () => {
      const foodEntriesReq = await axios.get(Config.backendEndpoint(`/foods/categories`));
      setFoodCategories(foodEntriesReq.data);
    }
    fetchFoodCategories().catch(console.log);
  }, [refetchFoodCategories]);
  
  function handleFoodClick(foodId) {
    return e => {
      setActionFoodId(foodId);
      setActionType('create');
    }
  }
  async function handleFoodAdd() {
    await axios.post(Config.backendEndpoint('/foods/entries'), {
      foodId: actionFoodId,
      foodCategoryId: foodCategory === 'null' ? null : foodCategory
    });
    setRefetchFoodEntries(!refetchFoodEntries);
  }
  function handleFoodRemoveClick(foodId) {
    return e => {
      if(foodEntries.filter(x => x.food_id === foodId).length > 0) {
        setActionFoodId(foodId);
        setActionType('delete');
      }
    }
  }
  async function handleFoodRemove() {
    const foodEntryTarget = foodEntries.reverse().find(x => x.food_id === actionFoodId && (foodCategory === 'null' ? x.food_category_id === null : x.food_category_id === foodCategory));
    if(foodEntryTarget) {
      console.log(foodEntryTarget);
      const foodEntryId = foodEntryTarget.food_entry_id;
      console.log(foodEntryId);
      await axios.delete(Config.backendEndpoint(`/foods/entries/${foodEntryId}`));
      setRefetchFoodEntries(!refetchFoodEntries);
    }
  }
  async function handleFoodAction(e) {
    await (actionType === 'delete' ? handleFoodRemove() : handleFoodAdd());
    
    handleFoodActionClose();
  }
  function handleFoodCreateClick(e) {
    setCreateFoodOpen(true);
  }
  function handleFoodCreateClose() {
    setCreateFoodOpen(false);
  }
  function handleFoodDeleteClick(e) {
    setDeleteFoodOpen(true);
  }
  function handleFoodDeleteClose(e) {
    setDeleteFoodOpen(false);
  }
  function handleUserRecoveryClick(e) {
    if(e.clientX < 5) {
      setUserRecoveryOpen(true);
    }
  }
  function handleUserRecoveryClose() {
    setUserRecoveryOpen(false);
  }
  function handleUserRecovery() {
    const tokenValue = userTokenRef.current.value;
    localStorage.setItem('userToken', tokenValue);
    window.location = '';
  }
  function handleFoodActionClose() {
    setActionFoodId(null);
  }
  
  async function handleFoodCreate()  {
    const foodName = newFoodNameRef.current.value;
    await axios.post(Config.backendEndpoint('/foods'), {
      name: foodName
    });
    const foodValuesRes = await axios.get(Config.backendEndpoint('/foods/'));
    const foodId = foodValuesRes.data.find(x => x.name === foodName).food_id;
    
    const nutrientValues = Object.entries(newFoodNutrientsRef.current).map(x => [x[0], x[1].value]);
    for(let [nutrientId, nutrientValue] of nutrientValues) {
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
  async function handleFoodDelete() {
    await axios.delete(Config.backendEndpoint(`/foods/${deleteFoodId}`));
    
    setDeleteFoodId('');
    setRefetchFoods(!refetchFoods);
    setDeleteFoodOpen(false);
  }
  
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.container, styles.leftContainer)}>
        <NutritionTable
          foods={foods}
          nutrients={nutrients}
          nutrientValues={nutrientValues}
          nutrientTotals={nutrientTotals}
          foodEntries={foodEntries}
          currentDate={currentDate}
          
          onFoodClick={handleFoodClick}
          onFoodRemoveClick={handleFoodRemoveClick}
          onDateChange={(date) => {
            if(date && date.isValid()) {
              setCurrentDate(date)
            }
          }}
        />
      </div>
      <div className={css(styles.container, styles.rightContainer)}>
        <Paper elevation={2} className={css(styles.actionsPaper)}>
          <Typography variant={'h5'} gutterBottom>Actions</Typography>
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleFoodCreateClick}>Create a new food</Button>
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleFoodDeleteClick}>Delete a food</Button>
          {/*<Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} onClick={handleNutrientCreateClick}>Create a new nutrition variable</Button>*/}
          <Button variant={'contained'} color={'primary'} className={css(styles.actionsButton)} startIcon={<GetAppIcon/>} href={Config.backendEndpoint('/data.csv')} target={'_blank'}>Download Data</Button>
        </Paper>
      </div>
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
      <Dialog open={deleteFoodOpen} onClose={handleFoodDeleteClose}>
        <DialogTitle style={{ paddingBottom: 0 }}>Delete a food type</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel id={'delete-food-type-label'}>Select a food to delete</InputLabel>
            <Select
              labelId={'delete-food-type-label'}
              value={deleteFoodId}
              onChange={(e) => setDeleteFoodId(e.target.value)}
            >
              {
                foods.map((food, foodKey) => (
                  <MenuItem key={foodKey} value={food.food_id}>{food.name}</MenuItem>
                ))
              }
            </Select>
            <FormHelperText>This will prevent future logging of this food item</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFoodDeleteClose} variant={'contained'}>
            Cancel
          </Button>
          <Button onClick={handleFoodDelete} variant={'contained'} color={'secondary'} disabled={deleteFoodId === ''}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={userRecoveryOpen} onClose={handleUserRecoveryClose}>
        <DialogTitle>Recover User Data</DialogTitle>
        <DialogContent>
          <DialogContentText>If this was opened by accident, just press "Cancel"</DialogContentText>
          <TextField inputRef={userTokenRef} label={'User Token'}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserRecoveryClose} variant={'contained'}>
            Cancel
          </Button>
          <Button onClick={handleUserRecovery} variant={'contained'} color={'primary'}>
            Recover
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={actionFoodId !== null} onClose={handleFoodActionClose}>
        <DialogTitle>{actionType === 'create' ? 'Add ' : 'Remove '}</DialogTitle>
        <DialogContent>
          <InputLabel id={'food-action-category-label'}>Select a meal</InputLabel>
          <FormControl className={classes.formControl}>
            <Select
              labelId={'food-action-category-label'}
              value={foodCategory}
              onChange={(e) => setFoodCategory(e.target.value)}
            >
              { (actionType !== 'delete' || foodEntries.find(y => y.food_category_id === null) !== undefined) && <MenuItem value={'null'}>None</MenuItem> }
              {
                foodCategories.filter(x => actionType !== 'delete' || foodEntries.find(y => y.food_category_id === x.food_category_id) !== undefined).map((x, i) => (
                  <MenuItem key={i} value={x.food_category_id}>{x.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFoodActionClose} variant={'contained'}>
            Cancel
          </Button>
          <Button onClick={handleFoodAction} variant={'contained'} color={actionType === 'deleted' ? 'secondary' : 'primary'}>
            {actionType === 'delete' ? 'Remove' : 'Add'}
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
    borderRight: '1px solid #dadada',
    flexGrow: 1,
    display: 'flex'
  },
  rightContainer: {
    flexGrow: 0
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
