import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Text from './Text';
import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

function NutritionTable(props) {
  const foods = props.foods;
  const nutrients = props.nutrients;
  const nutrientValues = props.nutrientValues;
  const foodEntries = props.foodEntries;
  
  const nutrientTotals = {};
  for(let nutrient of nutrients) {
    nutrientTotals[nutrient.nutrient_id] = 0;
    for(let foodEntry of foodEntries) {
      const nutrientValueEntry = nutrientValues.find(x => x.food_id === foodEntry.food_id && x.nutrient_id === nutrient.nutrient_id);
      if(!nutrientValueEntry) continue;
      nutrientTotals[nutrient.nutrient_id] += nutrientValueEntry.value;
    }
  }
  
  return (
    <Paper elevation={2} className={css(styles.rootPaper)}>
      <table className={css(styles.table)}>
        <thead>
          <tr>
            <th className={css(styles.th)}/>
            <th className={css(styles.th)}>Today's totals</th>
            {
              nutrients.map((nutrient, id) => (
                <th key={id} className={css(styles.th)}><Text>{nutrient.name}</Text></th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            foods.map((food, foodKey) => (
              <tr key={foodKey}>
                <td className={css(styles.td)}><Text>{food.name}</Text></td>
                <td className={css(styles.td)} align={'center'}>
                  <div>
                    <IconButton size={'small'} color={'primary'} onClick={props.onFoodClick(food.food_id)}><AddIcon/></IconButton>
                    <span>{
                      foodEntries.filter(x => x.food_id === food.food_id).length
                    }</span>
                    <IconButton size={'small'} color={'secondary'} onClick={props.onFoodRemoveClick(food.food_id)}><RemoveIcon/></IconButton>
                  </div>
                </td>
                {
                  nutrients.map((nutrient, nutrientId) => (
                    <td key={nutrientId} className={css(styles.td)} align={'right'}><Text>{nutrientValues.length > 0 ? nutrientValues.find(x => x.food_id === food.food_id && x.nutrient_id === nutrient.nutrient_id).value : null}</Text></td>
                  ))
                }
              </tr>
            ))
          }
          <tr>
            <td className={css(styles.bold)}>Total</td>
            <td className={css(styles.bold)} align={'center'}>{foodEntries.length}</td>
            {
              nutrients.map((nutrient, nutrientKey) => (
                <td key={nutrientKey} align={'right'}>
                  <Text bold>{nutrientTotals[nutrient.nutrient_id]}</Text>
                </td>
              ))
            }
          </tr>
        </tbody>
      </table>
    </Paper>
  );
}

NutritionTable.propTypes = {};

const styles = StyleSheet.create({
  rootPaper: {
    padding: '15px',
    width: 'fit-content'
  },
  table: {
    borderCollapse: 'collapse'
  },
  th: {
    borderBottom: '1px solid #ddd',
    // transform: 'rotate(-90deg)'
  },
  td: {
    borderBottom: '1px solid #ddd'
  },
  bold: {
    fontWeight: 'bold'
  }
});

export default NutritionTable;
