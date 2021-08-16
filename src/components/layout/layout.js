import React from 'react';
import * as styles from './layout.module.scss';

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
        result: 0,
      }
    }
  }

  handleClick(event) {
    /*let foo = this.mainRef.current;*/
    const results = [];
    let total = 0;
    const amount = event.target.dataset.amount ? event.target.dataset.amount : 1;
    const type = event.target.dataset.type;
    const modifier = event.target.dataset.modifier ? parseInt(event.target.dataset.modifier) : 0;
    for (let i=0,l=amount;i<l;i++) {
      const roll = 1 + Math.floor(Math.random()*type);
      results.push(roll);
      total = total + roll;
    }
    total = total + modifier;
    results.push(total);
    console.log(results);
  }

  componentDidMount() {
    const buttons = this.mainRef.current.getElementsByClassName('dmcm--dice-button');
    for (let i=0,l=buttons.length;i<l;i++) {
      buttons[i].addEventListener('click', this.handleClick);
    }

    /*const main = this.mainRef.current;
    const reg = new RegExp(/(\d*d\d+)/, 'g');
    const parts = main.innerHTML.split(reg);
    main.innerHTML = parts.map((part, i) => (
      part.match(reg) ? ReactDOMServer.renderToString(
        <button
          key={i}
          onClick={this.handleClick}
          className={styles.diceButton}
        >{part}</button>
      ) : (part)
    )).join('');*/
  }

  render() {
    const pageWrapperClasses = [styles.pageWrapper, this.props.pageWrapper, 'dmcm--pageWrapper'].join(' ');
    
    return (
      <div
        className={pageWrapperClasses}
      >
        <main
          ref={this.mainRef}
        >
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default Layout;