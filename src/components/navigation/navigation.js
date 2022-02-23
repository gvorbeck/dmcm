import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function Navigation() {
  const navArr = [
    {
      title: 'adventures',
      slug: '/adventures',
    },
    {
      title: 'bestiary',
      slug: '/search/?category=monsters',
    },
    {
      title: 'reference',
      slug: '/ref',
    },
    {
      title: 'spellbook',
      slug: '/search/?category=spells',
    },
  ];

  const navItems = navArr.map((item) => (
    <ListItem key={item.title}>
      <ListItemButton component="a" href={item.slug}>
        <ListItemText primary={item.title} />
      </ListItemButton>
    </ListItem>
  ));

  return (
    <nav>
      <List>
        {navItems}
      </List>
    </nav>
  );
}

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
