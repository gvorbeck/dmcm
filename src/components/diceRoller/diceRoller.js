import React from 'react';

class DiceRoller extends React.Component {
  render() {
    return (
      <button foo={this.props.foo}>{this.props.bar}</button>
    );
  }
}

export default DiceRoller;