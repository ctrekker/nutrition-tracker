import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { CardContent, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

function FoodsGrid(props) {
  const foods = props.foods.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (b.name < a.name) {
      return 1;
    }
    return 0;
  });
  
  return (
    <div>
      <Typography variant={'h5'}>Add a food</Typography>
      <Grid container>
        {
          foods.map((food, foodKey) => (
            <Grid key={foodKey} item xs={3}>
              <Card className={css(styles.foodCard)}>
                <CardActionArea onClick={props.onFoodClick(food.food_id)}>
                  <CardContent>
                    <Typography variant={'h6'}>{food.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </div>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    margin: '10px'
  }
});

export default FoodsGrid;
