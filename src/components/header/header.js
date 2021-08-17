import React from 'react';
import { Link } from 'gatsby';
import Navigation from '../navigation/navigation';

function Header(props) {
  return (
    <header>
      <h1>
        <Link to='/'>Dungeon Master's Campaign Manager</Link>
      </h1>
      {!props.homeNav &&
        <Navigation/>
      }
    </header>
  );
}

export default Header;
