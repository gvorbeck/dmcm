/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
import React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  Stack,
} from '@mui/material';

export default function Navigation(props) {
  const {
    display,
    navDir,
    width,
    sx,
    color,
    size,
    fullWidth,
  } = props;
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
      <Button
        variant="contained"
        size={size}
        // color={color || 'primary'}
        width="100%"
        href={item.slug}
        sx={{
          width: fullWidth && '100%',
        }}
      >
        {item.title}
      </Button>
    </ListItem>
  ));

  const CustomStack = (customProps) => <Stack component="ul" direction={navDir} {...customProps} />;

  if (display === false) {
    return null;
  }
  return (
    <Box
      component="nav"
      width={width}
      sx={sx}
    >
      <List disablePadding component={CustomStack}>
        {navItems}
      </List>
    </Box>
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
