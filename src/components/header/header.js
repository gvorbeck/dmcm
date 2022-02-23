import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigation from '../navigation/navigation';

function HeaderHomeLink(title) {
  return (
    <Typography variant="h1">
      <Link href="/">{title}</Link>
    </Typography>
  );
}

export default function Header(props) {
  const { displayNav, title } = props;

  return (
    <Container component="header">
      {title && HeaderHomeLink(title)}
      {displayNav && Navigation()}
    </Container>
  );
}

// import { Link, StaticQuery, graphql } from 'gatsby';
// import Navigation from '../navigation/navigation';
// import * as styles from './header.module.scss';

// function Header(props) {
//   return (
//     <StaticQuery
//       query={graphql`
//         query HeaderQuery {
//           site {
//             siteMetadata {
//               title
//             }
//           }
//         }
//       `}
//       render={data => (
//         <header className={styles.header}>
//           <div className={styles.bar}>
//             <h1 className={styles.title}>
//               <Link
//                 to='/'
//                 className={'game-icon game-icon-black-bridge'}
//               >DMCM</Link>
//             </h1>
//             {!props.homeNav &&
//               <Navigation/>
//             }
//           </div>
//         </header>
//       )}
//     />
//   );
// }

// export default Header;
