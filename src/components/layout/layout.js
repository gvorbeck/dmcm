import React from 'react';
import Header from '../header/header';
import * as styles from './layout.module.scss';

/*
TODOs:
- Add Simple Clicks to spell areas.
*/

/*
FloatTable:  Component
Arguments:   props, ref
Description: This component builds the floating tables that appear when a user
clicks a Roll button.
*/
const FloatTable = React.forwardRef((props, ref) => {
  let data = {},
      listItems;
  switch(props.tableType) {
    case 'dice-table':
      data.formula  = props.formula;
      data.modifier = props.modifier;
      data.rolls    = props.rolls;
      data.total    = props.total;
      data.sign     = data.modifier > 0 ? '+' : '';
      data.class    = styles.diceTable;

      const rollItems = data.rolls.length > 0 ? data.rolls.map((roll, i) => (
        <li key={i}>
          {roll}
        </li>
      )) : '';

      listItems = (
        <React.Fragment>
          <li>{data.formula}</li>
          {rollItems}
          {data.modifier !== 0 &&
            <li>{data.sign}{data.modifier}</li>
          }
          <li>{data.total}</li>
        </React.Fragment>
      );
      break;
    case 'attack-table':
      data.title    = props.title;
      data.tohit    = props.tohit;
      data.modifier = props.modifier;
      data.damage   = props.damage;
      data.type     = props.type;
      data.class    = styles.attackTable;
      if (data.tohit === 20 || data.tohit === 1) {
        data.crit = true;
      }

      listItems = (
        <React.Fragment>
          <li>{data.title}</li>
          <li>To Hit: {data.tohit + data.modifier}</li>
          {data.crit &&
            <li>Crit!</li>
          }
          <li>Damage: {data.damage} {data.type}</li>
        </React.Fragment>
      );
      break;
    case 'simple-table':
      data.roll     = props.roll;
      data.title    = props.title;
      data.modifier = props.modifier;
      data.sign     = data.modifier > 0 ? '+' : '';
      data.class    = styles.simpleTable;
      if (data.roll === 20 || data.roll === 1) {
        data.crit = true;
      }

      listItems = (
        <React.Fragment>
          <li>{data.title}</li>
          <li>{data.sign}{data.modifier}</li>
          {data.crit &&
            <li>Crit!</li>
          }
          <li>{data.roll === 1 ? 0 : (parseInt(data.modifier) + parseInt(data.roll))}</li>
        </React.Fragment>
      );
      break;
    default:
      return '';
  }
  return (
    <section
      ref={ref}
      className={data.class}
    >
      <ul>
        {listItems}
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
    this.handleClick       = this.handleClick.bind(this);
    this.handleRoll        = this.handleRoll.bind(this);
    this.handleScroll      = this.handleScroll.bind(this);

    this.state = {
      dice: {
        formula: '',
        rolls: [],
        total: 0,
        modifier: '',
      },
      attack: {
        title: '',
        tohit: 0,
        modifier: 0,
        formula: '',
        damage: 0,
        type: '',
      },
      simple: {
        title: '',
        roll: 0,
        modifier: 0,
        crit: false,
      },
      scroll: 0,
    }
  }

  handleRoll(die) {
    return (1 + Math.floor(Math.random()*die))
  }

  handleClick(event) {
    /*
    VARS: 
    target - ARRAY - the clicked button's data attributes.
    handleRoll - FUNCTION - localized instanciation of this.handleRoll function.
    reducer - FUNCTION - adds up values of array contents.
    CSS display property.
    */
    const target     = event.currentTarget.dataset,
          handleRoll = this.handleRoll,
          reducer    = (previousValue, currentValue) => previousValue + currentValue;

    /* Hide tables */
    this.diceTable.current.style.display = this.attackTable.current.style.display = this.simpleTable.current.style.display = 'none';

    function formulaRoll(formula, crit=false) {
      /* 
      Object 'obj' full of broken down dice formula data. Accounts for possibility of 
      formula being 0 - which happens when a user rolls a 1 to hit, causing a 
      "critical miss".
      */
      const obj = {
        formula:  formula,
        amount:   formula === 0 ? 0
                : formula.split('d')[0] ? parseInt(formula.split('d')[0])
                : 1,
        type:     formula === 0 ? 0
                : parseInt(formula.split('d')[1].split(/[+-]/)[0]),
        modifier: formula === 0 ? 0
                : formula.split(/\d*d\d+/)[1] ? parseInt(formula.split(/\d*d\d+/)[1])
                : 0,
        rolls:    [],
        total:    0,
      };
      /* Double the amount of damage dice if user rolls a 20 to hit. */
      obj.amount = crit ? obj.amount *= 2 : obj.amount;
      /* Roll each die and then assign its value to the 'rolls' array within the 'obj' object. */
      for (let i=0,l=obj.amount;i<l;i++) {
        obj.rolls.push(handleRoll(obj.type));
      }
      /*
      Reduce (add together) the 'rolls' array, adding the 'modifier' value as well before 
      assigning the 'total' value.
      */
      obj.total = obj.rolls.reduce(reducer, obj.modifier);
      return obj;
    }

    function attackRoll(attack) {
      /* This value is used multiple times so constructing it outside of the object becomes necessary. */
      const roll = handleRoll(20);
      /* See formulaRoll for details. This breaksdown the attack roll similarly. */
      const obj = {
        title:    attack.title,
        tohit:    roll,
        modifier: attack.modifier,
        formula:  attack.formula,
        type:     attack.type,
        damage:   roll === 1 ? formulaRoll(0)
                : roll === 20 ? formulaRoll(attack.formula, true)
                : formulaRoll(attack.formula),
      };
      return obj;
    }

    function simpleRoll(simple) {
      /* See formulaRoll and attackRoll for more info. These rolls handle Ability and Skill Checks. */
      const roll = handleRoll(20);
      const obj = {
        title:    simple.title,
        roll:     roll,
        modifier: simple.modifier,
        crit:     roll === 20 ? true
                : roll === 1 ? true
                : false,
      };
      return obj;
    }

    let obj;
    switch(target.roll) {
      case 'formula':
        obj      = formulaRoll(target.formula);
        let dice = {...this.state.dice};

        dice.formula  = obj.formula;
        dice.modifier = obj.modifier;
        dice.rolls    = obj.rolls;
        dice.total    = obj.total;

        this.setState({ dice });
        this.diceTable.current.style.display = 'block';
        break;
      case 'attack':
        obj        = attackRoll(target);
        let attack = {...this.state.attack};
        dice       = {...this.state.dice};

        attack.title = obj.title;
        attack.tohit = obj.tohit;
        attack.modifier = parseInt(obj.modifier);
        attack.formula = obj.formula;
        attack.type = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
        attack.damage = obj.damage.total;

        dice.formula = obj.formula;
        dice.modifier = obj.damage.modifier;
        dice.rolls = obj.damage.rolls;
        dice.total = obj.damage.total;

        this.setState({ dice, attack });
        this.diceTable.current.style.display = 'block';
        this.attackTable.current.style.display = 'block';
        break;
      case 'simple':
        obj        = simpleRoll(target);
        let simple = {...this.state.simple};
        
        simple.title    = obj.title;
        simple.roll     = obj.roll;
        simple.modifier = parseInt(obj.modifier);
        simple.crit     = obj.crit;

        this.setState({ simple });
        this.simpleTable.current.style.display = 'block';
        break;
      default:
        return '';
    }
    const clickDate = new Date();
    console.log(
      'Dice Roll @' + clickDate.getHours() + ':' + clickDate.getMinutes() + ':' + clickDate.getSeconds() +
      (obj.title ? '\nTitle: ' + obj.title : '') + 
      (obj.formula ? '\nFormula: ' + obj.formula : '') + 
      (obj.modifier ? '\nModifier: ' + obj.modifier : '') + 
      (obj.tohit ? '\nTo Hit: ' + obj.tohit : '') +
      (obj.type ? '\nType: ' + obj.type : '') +
      (obj.rolls ? '\nRolls: ' + obj.rolls : '') + 
      (obj.roll ? '\nRoll: ' + obj.roll : '') +
      (obj.crit ? '\nCrit: ' + obj.crit : '') +
      (obj.damage ? '\nDamage: ' + obj.damage.total : '') +
      (obj.total ? '\nTotal: ' + obj.total : '')
    );
  }

  handleScroll(event) {
    this.setState({
      scroll: window.scrollY
    });
  }

  getButtons() {
    const diceButtons    = this.mainRef.current.getElementsByClassName('dmcm--dice-button'),
          attackButtons  = this.mainRef.current.getElementsByClassName('dmcm--attack-button'),
          simpleButtons  = this.mainRef.current.getElementsByClassName('dmcm--simple-button');

    const buttonClickListeners = (buttons) => {
      for (let i=0,l=buttons.length;i<l;i++) {
        buttons[i].addEventListener('click', this.handleClick);
      }
    }

    buttonClickListeners(diceButtons);
    buttonClickListeners(attackButtons);
    buttonClickListeners(simpleButtons);
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
            <FloatTable
              ref={this.diceTable}
              tableType='dice-table'
              formula={this.state.dice.formula}
              modifier={this.state.dice.modifier}
              rolls={this.state.dice.rolls}
              total={this.state.dice.total}
            />
            <FloatTable
              ref={this.attackTable}
              tableType='attack-table'
              title={this.state.attack.title}
              tohit={this.state.attack.tohit}
              modifier={this.state.attack.modifier}
              formula={this.state.attack.formula}
              damage={this.state.attack.damage}
              type={this.state.attack.type}
            />
            <FloatTable
              ref={this.simpleTable}
              tableType='simple-table'
              crit={this.state.simple.crit}
              modifier={this.state.simple.modifier}
              roll={this.state.simple.roll}
              title={this.state.simple.title}
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
