import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@material-ui/core';

function Text(props) {
  return (
    <Typography variant={'subtitle1'} className={css(props.bold ? styles.bolded : null)}>{props.children}</Typography>
  );
}

const styles = StyleSheet.create({
  bolded: {
    fontWeight: 'bold'
  }
});

export default Text;
