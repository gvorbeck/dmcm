import React from 'react';
import Header from '../header/header';
import * as styles from './layout.module.scss';

const DiceTable = React.forwardRef((props, ref) => {
  const modifierSign = props.modifier > 0 ? '+' : '',
  formula = props.amount + 'd' + props.type + modifierSign + (props.modifier === 0 ? '' : props.modifier),
  rolls = props.rolls ? props.rolls.map((roll, i) => {
    if (props.rolls.length === i + 1) {
      return (
        <li key={i}>
          {roll + props.modifier}
        </li>
      );
    } else {
      return (
        <li key={i}>
          {roll}
        </li>
      );
    }
  }) : '';
  return (
    <section ref={ref} className={styles.diceTable}>
      <ul>
        <li className={styles.diceFormula}>{formula}</li>
        {rolls}
        {props.amount > 1 &&
          <li className={styles.diceResult}>{props.result}</li>
        }
      </ul>
    </section>
  );
})

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mainRef = React.createRef();
    this.diceButtonRef = React.createRef();
    this.diceTable = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.getButtons = this.getButtons.bind(this);
    this.state = {
      dice: {
        amount: 0,
        type: 0,
        modifier: 0,
        rolls: [],
        result: 0,
      }
    }
  }

  handleClick(event) {
    let total = 0;
    let dice = {...this.state.address};
    dice.amount = event.target.dataset.amount ? parseInt(event.target.dataset.amount) : 1;
    dice.type = parseInt(event.target.dataset.type);
    dice.modifier = event.target.dataset.modifier ? parseInt(event.target.dataset.modifier) : 0;
    dice.rolls = [];

    for (let i=0,l=dice.amount;i<l;i++) {
      const roll = 1 + Math.floor(Math.random()*dice.type);
      dice.rolls.push(roll);
      total = total + roll;
    }

    dice.result = total + dice.modifier;
    this.setState({ dice });
    this.diceTable.current.style.display = 'block';
  }

  getButtons() {
    const buttons = this.mainRef.current.getElementsByClassName('dmcm--dice-button');
    for (let i=0,l=buttons.length;i<l;i++) {
      buttons[i].addEventListener('click', this.handleClick);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      /* this is delayed because some pages render their <Dice/> components AFTER layout and makes buttons not work. */
      /* I know this is less than ideal, but it works. I'll fix... some day. */
      this.getButtons();
    }, 500);
  }

  render() {
    const pageWrapperClasses = [styles.pageWrapper, this.props.className, 'dmcm--pageWrapper'].join(' ');
    
    return (
      <div
        className={pageWrapperClasses}
      >
        <Header
          homeNav={this.props.homeNav}
        />
        <main
          ref={this.mainRef}
          className={'dmcm--layout'}
        >
          {this.props.icon &&
            <div className={'game-icon ' + this.props.icon}/>
          }
          {this.props.title &&
            <h2 className={styles.pageTitle}>{this.props.title}</h2>
          }
          <DiceTable
            amount={this.state.dice.amount}
            type={this.state.dice.type}
            modifier={this.state.dice.modifier}
            rolls={this.state.dice.rolls}
            result={this.state.dice.result}
            ref={this.diceTable}
          />
          {this.props.children}
        </main>
        <footer>
          <p>© {new Date().getFullYear()} J. Garrett Vorbeck</p>
        </footer>
      </div>
    );
  }
}

export default Layout;
