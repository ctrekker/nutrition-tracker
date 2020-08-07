import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Text from './Text';
import { Paper, TableContainer } from '@material-ui/core';

function NutritionTable(props) {
  const foods = props.foods;
  const nutrients = props.nutrients;
  const nutrientValues = props.nutrientValues;
  const foodEntries = props.foodEntries;
  
  console.log(nutrients);
  
  return (
    <Paper elevation={2} className={css(styles.rootPaper)}>
      <table className={css(styles.table)}>
        <thead>
          <tr>
            <th className={css(styles.th)}/>
            {
              nutrients.map((nutrient, id) => (
                <th key={id} className={css(styles.th)}><Text>{nutrient.name}</Text></th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            foodEntries.map((foodEntry, foodEntryId) => (
              <tr key={foodEntryId}>
                <td className={css(styles.td)}><Text>{foods.find(x => x.food_id === foodEntry.food_id).name}</Text></td>
                {
                  nutrients.map((nutrient, nutrientId) => (
                    <td key={nutrientId} className={css(styles.td)} align={'right'}><Text>{nutrientValues.find(x => x.food_id === foodEntry.food_id && x.nutrient_id === nutrient.nutrient_id).value}</Text></td>
                  ))
                }
              </tr>
            ))
          }
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
  }
});

export default NutritionTable;
