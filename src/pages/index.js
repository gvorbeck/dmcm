import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';
import Navigation from '../components/navigation/navigation';
import * as styles from '../styles/index.module.scss';

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

class IndexPage extends React.Component {
  render() {
    return (
      <Layout
        className={styles.indexWrapper}
        homeNav={true}
      >
        <h2 className={styles.greeting}>Hail fellow well met.</h2>
        <Navigation/>
        <p className={styles.description}>The DMCM is a React-based campaign manager for your favorite 5E TTRPG.</p>

        <div className={styles.wizard}/>
      </Layout>
    )
  }
}

export default IndexPage;
