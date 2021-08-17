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
        <header
          className={styles.header}
        >
          <div>
            <StaticImage
              src='../../images/wizard.png'
              alt={data.site.siteMetadata.title}
              placeholder='blurred'
              layout='fixed'
              width={40}
              className={styles.image}
            />
            <h1>
              <Link to='/'>{data.site.siteMetadata.title}</Link>
            </h1>
          </div>
          {!props.homeNav &&
            <Navigation/>
          }
        </header>
      )}
    />
  );
}

export default Header;
