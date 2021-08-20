import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
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
            {!props.homeNav &&
              <StaticImage
                src='../../images/wizard.png'
                alt={data.site.siteMetadata.title}
                placeholder='blurred'
                layout='fixed'
                width={150}
                className={styles.image}
              />
            } 
        </header>
      )}
    />
  );
}

export default Header;
