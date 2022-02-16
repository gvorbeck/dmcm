import React from 'react';
import { Link } from 'gatsby';
import Navigation from '../navigation/navigation';

function HeaderHomeLink(title) {
  return (
    <h1>
      <Link to="/">{title}</Link>
    </h1>
  );
}

function Header(props) {
  const { displayNav, title } = props;
  return (
    <header>
      {title && HeaderHomeLink(title)}
      {displayNav && Navigation()}
    </header>
  );
}

export default Header;

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
