import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import NutritionTable from './NutritionTable';
import FoodsGrid from './FoodsGrid';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Config from './Config';

function App() {
  const [ foods, setFoods ] = useState([]);
  const [ nutrients, setNutrients ] = useState([]);
  const [ nutrientValues, setNutrientValues ] = useState([]);
  const [ foodEntries, setFoodEntries ] = useState([]);
  
  useEffect(() => {
    const fetchFoods = async () => {
      const foodReq = await axios.get(Config.backendEndpoint('/foods'));
      setFoods(foodReq.data);
    }
    fetchFoods().catch(console.log);
  }, []);
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
  }, []);
  useEffect(() => {
    const fetchFoodEntries = async () => {
      const foodEntriesReq = await axios.get(Config.backendEndpoint('/foods/entries'));
      setFoodEntries(foodEntriesReq.data);
    }
    fetchFoodEntries().catch(console.log);
  }, []);
  
  function handleFoodClick(foodId) {
    return e => {
      console.log(foodId);
    };
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
        />
      </div>
      <div className={css(styles.container, styles.rightContainer)}>
        <FoodsGrid foods={foods} onFoodClick={handleFoodClick}/>
      </div>
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
  }
});

export default App;
