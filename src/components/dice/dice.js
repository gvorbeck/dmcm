import React from 'react';
import * as styles from './dice.module.scss';

class Dice extends React.Component {
  render() {
    const regex = new RegExp(/(\W*)(\d*d\d+\+?-?\d*)(\W*)/),
    formula = regex.test(this.props.children) === true ? JSON.stringify(this.props.children).replace(/"]|[["]/g, '') : '???',
    amount = formula.split('d')[0],
    type = formula.split('d')[1].split(/[+-]/)[0],
    modifier = formula.split(/\d*d\d+/)[1];
    return (
      <button
        aria-label='Dice Roller Button'
        className={styles.button + ' dmcm--dice-button'}
        data-amount={amount}
        data-type={type}
        data-modifier={modifier}
        data-formula={amount + 'd' + type + modifier}
      >
        {formula}
      </button>
    );
  }
}

export default Dice;
