import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import Navigation from '../navigation/navigation';
import * as styles from './header.module.scss';

function Header(props) {
  return (
    <StaticQuery
      query={graphql`
        query HeaderQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <header className={styles.header}>
          <div className={styles.bar}>
            <h1 className={styles.title}>
              <Link to='/'>DMCM</Link>
            </h1>
            {!props.homeNav &&
              <Navigation/>
            }
          </div>
        </header>
      )}
    />
  );
}

export default Header;
