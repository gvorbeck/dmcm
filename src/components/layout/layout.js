import React from 'react';
import Header from '../header/header';
import * as styles from './layout.module.scss';

function DiceTable(props) {
  const formula = props.amount + 'd' + props.type + '+' + props.modifier;
  const rolls = props.rolls ? props.rolls.map((roll, i) => (
    <li key={i}>
      {roll}
    </li>
  )) : '';
  return (
    <section className={styles.diceTable}>
      <ul>
        <li>{formula}</li>
        {rolls}
        <li>{props.result}</li>
      </ul>
    </section>
  );
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mainRef = React.createRef();
    this.diceButtonRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
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
    this.setState( { dice });
    console.log(this.state.dice);
  }

  componentDidMount() {
    const buttons = this.mainRef.current.getElementsByClassName('dmcm--dice-button');
    for (let i=0,l=buttons.length;i<l;i++) {
      buttons[i].addEventListener('click', this.handleClick);
    }
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
          <DiceTable
            amount={this.state.dice.amount}
            type={this.state.dice.type}
            modifier={this.state.dice.modifier}
            rolls={this.state.dice.rolls}
            result={this.state.dice.result}
          />
          <h2 className={styles.pageTitle}>{this.props.title}</h2>
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
