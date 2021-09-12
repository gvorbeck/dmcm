import React from 'react';
import { Link } from 'gatsby';

function linkBuilder(type, children) {
  let abb = (type === 'monsters') ? 'm' : (type === 'spells') ? 's' : '';
  const encodedSubject = encodeURI(children.join().toLowerCase());
  return (
    <Link
      to={`/${type}/?${abb}=${encodedSubject}`}
    >
      {children}
    </Link>
  );
}

function SpellLink(props) {
  return (
    linkBuilder('spells', props.children)
  );
}

function MonsterLink(props) {
  return (
    linkBuilder('monsters', props.children)
  );
}

export {
  MonsterLink,
  SpellLink
};
