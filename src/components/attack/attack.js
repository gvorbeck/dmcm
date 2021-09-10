import React from 'react';

class Attack extends React.Component {
  render() {
    const raw = this.props.children.join('').split('|'),
    attack = {
      name: raw[0],
      tohit: raw[1],
      formula: raw[2],
      type: raw[3]
    };

    console.log(raw);
    return (
      <button
        aria-label='Attack Button'
        className={`dmcm--attack-button`}
        data-name={attack.name}
        data-tohit={attack.tohit}
        data-formula={attack.formula}
        data-type={attack.type}
      >
        {attack.name}
      </button>
    );
  }
}

export default Attack;
