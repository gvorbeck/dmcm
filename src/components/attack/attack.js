import React from 'react';

class Attack extends React.Component {
  render() {
    const raw = this.props.children.join('').split('|'),
    attack = {
      title: raw[0],
      modifier: raw[1],
      formula: raw[2],
      type: raw[3]
    };

    return (
      <button
        aria-label='Attack Button'
        className={`dmcm--attack-button`}
        data-roll='attack'
        data-formula={attack.formula}
        data-title={attack.title}
        data-modifier={attack.modifier}
        data-type={attack.type}
      >
        {attack.title}
      </button>
    );
  }
}

export default Attack;
