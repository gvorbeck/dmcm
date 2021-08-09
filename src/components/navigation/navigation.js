import React from 'react';
import { Link } from 'gatsby';

function NavItem(props) {
  return (
    <li>
      <Link to={props.slug}>{props.title}</Link>
    </li>
  )
}

function Navigation(props) {
  const nav = [
    {
      title: 'Adventures',
      slug: '/adventures'
    },
    {
      title: 'Bestiary',
      slug: '/monsters'
    },
    {
      title: 'Reference',
      slug: '/ref'
    },
    {
      title: 'Spellbook',
      slug: '/spells'
    }
  ];
  
  return (
    <nav>
      <ul>
        {
          nav.length &&
          nav.map((item, i) => (
            <NavItem
              key={i}
              title={item.title}
              slug={item.slug}
            />
          ))
        }
      </ul>
    </nav>
  )
}

export default Navigation;