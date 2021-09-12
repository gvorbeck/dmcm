import React from 'react';
import Header from '../header/header';
import * as styles from './layout.module.scss';

/*
TODOs:
- add Critical Hit/Miss alerts.
- add Simple Clicks to monster skills/saving throws.
- Add Simple Clicks to spell areas.
- Add hints to search forms: (ex: type 'example')
*/

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
        <li>{props.tohitRoll}</li>
        <li>({props.damage} {props.type})</li>
      </ul>
    </section>
  );
});

const SimpleTable = React.forwardRef((props, ref) => {
  let crit = false;
  if (props.roll === 20 || props.roll === 0) {
    crit = true;
  }
  return (
    <section
      ref={ref}
      className={styles.simpleTable}
    >
      <ul>
        <li>{props.title}</li>
        <li>{props.value >= 0 ? '+' : ''}{props.value}</li>
        {crit &&
          <li>Crit!</li>
        }
        <li>{parseInt(props.value) + parseInt(props.roll)}</li>
      </ul>
    </section>
  );
});

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.mainRef       = React.createRef();
    this.diceButtonRef = React.createRef();
    this.diceTable     = React.createRef();
    this.attackTable   = React.createRef();
    this.simpleTable   = React.createRef();

    this.getButtons        = this.getButtons.bind(this);
    this.handleAttackClick = this.handleAttackClick.bind(this);
    this.handleClick       = this.handleClick.bind(this);
    this.handleRoll        = this.handleRoll.bind(this);
    this.handleScroll      = this.handleScroll.bind(this);
    this.handleSimpleClick = this.handleSimpleClick.bind(this);

    this.state = {
      dice: {
        amount: 0,
        type: 0,
        modifier: 0,
        rolls: [],
        result: 0,
        formula: '',
      },
      attack: {
        name: '',
        tohit: 0,
        tohitRoll: 0,
        formula: '',
        damage: 0,
        type: '',
      },
      simple: {
        title: '',
        roll: 0,
        value: 0,
      },
      scroll: 0,
    }
  }

  handleRoll(die) {
    return (1 + Math.floor(Math.random()*die))
  }

  handleClick(event) {
    let total     = 0;
    let dice      = {...this.state.dice};
    dice.amount   = event.target.dataset.amount ? parseInt(event.target.dataset.amount) : 1;
    dice.type     = parseInt(event.target.dataset.type);
    dice.modifier = event.target.dataset.modifier ? parseInt(event.target.dataset.modifier) : 0;
    dice.formula  = event.target.dataset.formula;
    dice.rolls    = [];

    for (let i=0,l=dice.amount;i<l;i++) {
      const roll = this.handleRoll(dice.type);
      dice.rolls.push(roll);
      total = total + roll;
    }

    dice.result = total + dice.modifier;
    this.setState({ dice });
    this.diceTable.current.style.display = 'block';
    this.attackTable.current.style.display = 'none';
    this.simpleTable.current.style.display = 'none';

    const clickDate = new Date();
    console.log(`Dice Roll @${clickDate.getHours()}:${clickDate.getMinutes()}\nFormula: ${dice.formula}\nRolls: ${dice.rolls.join(', ')}\nTotal: ${dice.result}`)
  }

  handleAttackClick(event) {
    let attack       = {...this.state.attack},
        damageTotal  = 0;
    attack.name      = event.target.dataset.name;
    attack.tohit     = parseInt(event.target.dataset.tohit, 10);
    attack.tohitRoll = this.handleRoll(20) + attack.tohit;
    attack.formula   = event.target.dataset.formula;
    attack.type      = event.target.dataset.type;
    damageTotal      = parseInt(attack.formula.split(/\d*d\d+/)[1]);
    attack.formula   = attack.formula.split('d');

    for (let i=0,l=attack.formula[0];i<l;i++) {
      const roll = this.handleRoll(attack.formula[1].split(/[+-]?/)[0]);
      damageTotal += roll;
    }
    attack.damage = damageTotal;

    this.setState({ attack });
    this.attackTable.current.style.display = 'block';
    this.diceTable.current.style.display = 'none';
    this.simpleTable.current.style.display = 'none';

    const clickDate = new Date();
    console.log(`Attack Roll @${clickDate.getHours()}:${clickDate.getMinutes()}\nName: ${attack.name}\nTo Hit: ${attack.tohitRoll}\nDamage: ${attack.damage} ${attack.type}`);
  }

  handleSimpleClick(event) {
    let simple = {...this.state.simple};
    simple.title = event.currentTarget.dataset.title;
    simple.value = event.currentTarget.dataset.modifier;
    simple.roll = this.handleRoll(20);

    this.setState({ simple });
    this.attackTable.current.style.display = 'none';
    this.diceTable.current.style.display = 'none';
    this.simpleTable.current.style.display = 'block';

    const clickDate = new Date();
    console.log(`${simple.title} @${clickDate.getHours()}:${clickDate.getMinutes()}\nModifier: ${simple.value}\nTotal: ` + (parseInt(simple.value) + parseInt(simple.roll)));
  }

  handleScroll(event) {
    this.setState({
      scroll: window.scrollY
    });
  }

  getButtons() {
    const diceButtons    = this.mainRef.current.getElementsByClassName('dmcm--dice-button'),
          attackButtons  = this.mainRef.current.getElementsByClassName('dmcm--attack-button'),
          abilityButtons = this.mainRef.current.getElementsByClassName('dmcm--ability-button'),
          simpleButtons  = this.mainRef.current.getElementsByClassName('dmcm--simple-button');

    const buttonClickListeners = (buttons, func) => {
      for (let i=0,l=buttons.length;i<l;i++) {
        buttons[i].addEventListener('click', func);
      }
    }

    buttonClickListeners(diceButtons, this.handleClick);
    buttonClickListeners(attackButtons, this.handleAttackClick);
    buttonClickListeners(abilityButtons, this.handleSimpleClick);
    buttonClickListeners(simpleButtons, this.handleSimpleClick);
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
          <div className={styles.dataFloater}>
            <DiceTable
              ref={this.diceTable}
              amount={this.state.dice.amount}
              type={this.state.dice.type}
              modifier={this.state.dice.modifier}
              rolls={this.state.dice.rolls}
              result={this.state.dice.result}
              formula={this.state.dice.formula}
            />
            <AttackTable
              ref={this.attackTable}
              name={this.state.attack.name}
              tohit={this.state.attack.tohit}
              tohitRoll={this.state.attack.tohitRoll}
              formula={this.state.attack.formula}
              damage={this.state.attack.damage}
              type={this.state.attack.type}
            />
            <SimpleTable
              ref={this.simpleTable}
              title={this.state.simple.title}
              value={this.state.simple.value}
              roll={this.state.simple.roll}
            />
          </div>
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
