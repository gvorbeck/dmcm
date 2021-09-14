import React from 'react';

class Simple extends React.Component {
  render() {
    return (
      <button
        aria-label={this.props.title}
        className='dmcm--simple-button'
        data-roll='simple'
        data-modifier={this.props.modifier}
        data-title={this.props.title}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Simple;
