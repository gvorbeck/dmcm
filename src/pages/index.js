import React from 'react';
import { graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
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
        pageWrapper={styles.indexWrapper}
        homeNav={true}
      >
        <StaticImage
          src='../images/wizard.png'
          alt={this.props.data.site.siteMetadata.title}
          placeholder='blurred'
          layout='fixed'
          width={300}
        />
        <h1>Hail fellow well met.</h1>
        <Navigation/>
        <p>The DMCM is a React-based campaign manager for any 5E TTRPG.</p>
      </Layout>
    )
  }
}

export default IndexPage;
