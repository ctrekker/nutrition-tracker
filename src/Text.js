import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@material-ui/core';

function Text(props) {
  return (
    <Typography variant={'subtitle1'}>{props.children}</Typography>
  );
}

const styles = StyleSheet.create({

});

export default Text;
