import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table as TableMaterial } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function Table({
  data,
}) {
  const classes = useMemo(() => makeStyles({
    table: {
      minWidth: 650,
    },
  }), []);

  return (
    <TableContainer component={Paper}>
      <TableMaterial className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Random</TableCell>
            <TableCell align="right">Text</TableCell>
            <TableCell align="right">Test</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMaterial>
    </TableContainer>
  );
}
