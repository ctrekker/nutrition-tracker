import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

function FoodsGrid(props) {
  const foods = props.foods.sort((a, b) => {
    const a_name = a.name.toUpperCase();
    const b_name = b.name.toUpperCase();
    if (a_name < b_name) {
      return -1;
    }
    if (b_name < a_name) {
      return 1;
    }
    return 0;
  });
  
  return (
    <div>
      <div className={css(styles.headerContainer)}>
        <Typography variant={'h5'}>Add a food</Typography>
        <div style={{ flexGrow: 1 }}/>
        <Button color={'primary'} variant={'contained'} onClick={props.onCreateFoodClick}>Create new food item</Button>
      </div>
      <List>
        {
          foods.map((food, foodKey) => (
            <ListItem key={foodKey} button onClick={props.onFoodClick(food.food_id)}>
              <Typography variant={'h6'}>{food.name}</Typography>
            </ListItem>
          ))
        }
      </List>
    </div>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    alignItems: 'center'
  }
});

export default FoodsGrid;
