import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Text from './Text';
import { Paper, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Fab from '@material-ui/core/Fab';
import { DatePicker, LocalizationProvider } from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
const SmallFab = withStyles({
  root: {
    minHeight: '25px'
  },
  sizeSmall: {
    padding: 0,
    width: '25px',
    height: '25px'
  }
})(Fab);

function NutritionTable(props) {
  const foods = props.foods;
  const nutrients = props.nutrients;
  const nutrientValues = props.nutrientValues;
  const nutrientTotals = props.nutrientTotals;
  const foodEntries = props.foodEntries;
  const currentDate = props.currentDate;
  
  const isToday = moment().isSame(currentDate, 'day');
  
  let displayDate = currentDate.format('M/D/YYYY');
  if(moment().add(1, 'day').isSame(currentDate, 'day')) {
    displayDate = 'Tomorrow\'s';
  }
  else if(moment().subtract(1, 'day').isSame(currentDate, 'day')) {
    displayDate = 'Yesterday\'s';
  }
  else if(moment().isSame(currentDate, 'day')) {
    displayDate = 'Today\'s';
  }
  
  return (
    <Paper elevation={2} className={css(styles.rootPaper)}>
      <div className={css(styles.headers)}>
        <Typography variant={'h5'} gutterBottom>{displayDate} Nutrition Table</Typography>
        <div style={{ flexGrow: 1 }}/>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            value={currentDate}
            onChange={(date) => props.onDateChange(date)}
          />
        </LocalizationProvider>
      </div>
      <Typography variant={'h6'}>Totals</Typography>
      <div className={css(styles.totalsContainer)}>
        {
          nutrients.map((nutrient, nutrientKey) => (
            <div key={nutrientKey} className={css(styles.totalsItem)}>
              <Typography variant={'body1'}>{nutrient.name}</Typography>
              <Typography variant={'h6'}>{nutrientTotals[nutrient.nutrient_id]}</Typography>
            </div>
          ))
        }
      </div>
      <table className={css(styles.table)}>
        <thead>
          <tr>
            <th className={css(styles.th)}/>
            <th className={css(styles.th)}>Quantities</th>
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
                    { isToday &&
                      <SmallFab size={'small'} color={'primary'} onClick={props.onFoodClick(food.food_id)}><AddIcon/></SmallFab>
                    }
                    <span className={css(styles.foodTotals)}>{
                      foodEntries.filter(x => x.food_id === food.food_id).length
                    }</span>
                    { isToday &&
                      <SmallFab size={'small'} color={'secondary'} onClick={props.onFoodRemoveClick(food.food_id)}><RemoveIcon/></SmallFab>
                    }
                  </div>
                </td>
                {
                  nutrients.map((nutrient, nutrientId) => {
                    const nutrientValue = nutrientValues.find(x => x.food_id === food.food_id && x.nutrient_id === nutrient.nutrient_id);
                    return (
                      <td key={nutrientId} className={css(styles.td)} align={'right'}>
                        { nutrientValue ?
                          <Text>{nutrientValues.length > 0 ? nutrientValue.value : null}</Text>
                          :
                          null
                        }
                      </td>
                    );
                  })
                }
              </tr>
            ))
          }
          <tr>
            <td className={css(styles.bold)}>Total</td>
            <td className={css(styles.bold)} align={'center'}><span className={css(styles.foodTotals)}>{foodEntries.length}</span></td>
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
    width: 'fit-content',
    flexGrow: 1
  },
  headers: {
    display: 'flex'
  },
  totalsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    border: '1px solid #ddd',
    marginBottom: '8px'
  },
  totalsItem: {
    margin: '5px 0'
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%'
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
  },
  foodTotals: {
    fontSize: '14pt',
    display: 'inline-block',
    margin: '0 5px'
  }
});

export default NutritionTable;
