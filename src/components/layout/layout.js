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
    <section
      ref={ref}
      className={styles.diceTable}
    >
      <ul>
        <li className={styles.diceFormula}>{formula}</li>
        {rolls}
        {props.amount > 1 &&
          <li>{props.result}</li>
        }
      </ul>
    </section>
  );
});

const AttackTable = React.forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      className={styles.attackTable}
    >
      <ul>
        <li>{props.name}</li>
      </ul>
    </section>
  );
});

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mainRef = React.createRef();
    this.diceButtonRef = React.createRef();
    this.diceTable = React.createRef();
    this.attackTable = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleAttackClick = this.handleAttackClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getButtons = this.getButtons.bind(this);
    this.state = {
      dice: {
        amount: 0,
        type: 0,
        modifier: 0,
        rolls: [],
        result: 0,
      },
      attack: {
        name: '',
        modifier: 0,
        formula: '',
        type: '',
      },
      scroll: 0,
    }
  }

  handleClick(event) {
    let total = 0;
    let dice = {...this.state.dice};
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

  handleAttackClick(event) {
    console.log('foo');
    let attack = {...this.state.attack};
    attack.name = event.target.dataset.name;

    this.setState({ attack });
    console.log(attack);
  }

  handleScroll(event) {
    this.setState({
      scroll: window.scrollY
    });
    console.log(this.state.scroll);
  }

  getButtons() {
    const buttons = this.mainRef.current.getElementsByClassName('dmcm--dice-button');
    const attackButtons = this.mainRef.current.getElementsByClassName('dmcm--attack-button');
    for (let i=0,l=buttons.length;i<l;i++) {
      buttons[i].addEventListener('click', this.handleClick);
    }
    for (let i=0,l=attackButtons.length;i<l;i++) {
      attackButtons[i].addEventListener('click', this.handleAttackClick);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      /* This is delayed because some pages render their components AFTER <Layout/> and makes buttons not work if rendered after <Layout/>. */
      /* I know this is less than ideal, but it works. I'll fix... some day. */
      this.getButtons();
    }, 500);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    /* Runs again so that when searching, new results containing buttons are given event listeners. */
    this.getButtons();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <div className={`dmcm--pageWrapper ${this.props.className}`}>
        <Header homeNav={this.props.homeNav}/>
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
          <AttackTable
            name={this.state.attack.name}
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
