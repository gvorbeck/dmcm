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
    let foo = this.mainRef.current;
    console.log(foo);
    console.log('foo');
  }

  componentDidMount() {
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