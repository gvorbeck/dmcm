import React from 'react';
import * as styles from './dice.module.scss';

class Dice extends React.Component {
  render() {
    let formula;
    const regex = new RegExp(/(\W*)(\d*d\d+\+?-?\d*)(\W*)/);
    if (typeof this.props.children === 'string') {
      formula = regex.test(this.props.children) === true ? this.props.children.trim() : '???';
    } else {
      formula = regex.test(this.props.children[0]) === true ? this.props.children[0].trim() : '???';
    }
    return (
      <button
        aria-label='Dice Roller Button'
        className={`${styles.button} dmcm--dice-button`}
        data-roll='formula'
        data-formula={formula}
      >
        {formula}
      </button>
    );
  }
}

export default Dice;
