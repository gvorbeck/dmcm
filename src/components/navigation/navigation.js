import React from 'react';
import { Link } from 'gatsby';

function Navigation() {
  const navArr = [
    {
      title: 'adventures',
      slug: '/adventures',
    },
    {
      title: 'bestiary',
      slug: '/monsters',
    },
    {
      title: 'reference',
      slug: '/ref',
    },
    {
      title: 'spellbook',
      slug: '/spellbook',
    },
  ];

  const navItems = navArr.map((item) => (
    <li key={item.title}>
      <Link to={item.slug}>{item.title}</Link>
    </li>
  ));

  return (
    <nav>
      <ul>
        {navItems}
      </ul>
    </nav>
  );
}

export default Navigation;

// function NavItem(props) {
//   return (
//     <li>
//       <Link to={props.slug}>{props.title}</Link>
//     </li>
//   )
// }
// function Navigation() {
//   const nav = [
//     {
//       title: 'Adventures',
//       slug: '/adventures'
//     },
//     {
//       title: 'Bestiary',
//       slug: '/monsters'
//     },
//     {
//       title: 'Reference',
//       slug: '/ref'
//     },
//     {
//       title: 'Spellbook',
//       slug: '/spells'
//     }
//   ];
//   return (
//     <nav>
//       <ul>
//         {
//           nav.length &&
//           nav.map((item, i) => (
//             <NavItem
//               key={i}
//               title={item.title}
//               slug={item.slug}
//             />
//           ))
//         }
//       </ul>
//     </nav>
//   )
// }

// export default Navigation;
