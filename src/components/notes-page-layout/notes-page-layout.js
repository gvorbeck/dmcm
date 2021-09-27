import React from 'react';
import { graphql, Link } from 'gatsby';
import Dice from '../dice/dice';
import Layout from '../layout/layout';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import * as styles from './notes-page-layout.module.scss';

export const query = graphql`
  query ($id: String, $pid: String) {
    mdx(id: {eq: $id}) {
      id
      body
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    adventure: mdx(id: {eq: $pid}) {
      slug
    }
  }
`

const shortcodes = { Dice };

class NotesPage extends React.Component {
  render() {
    return (
      <Layout
        title={this.props.data.mdx.frontmatter.title}
        className={styles.notesWrapper}
        pageTitle={this.props.data.mdx.frontmatter.title + ': DMCM'}     
      >
        <Link to={`/${this.props.data.adventure.slug}`}>Back</Link>
        <h1>{this.props.data.mdx.frontmatter.title}</h1>
        <MDXProvider components={ shortcodes }>
          <MDXRenderer>
            {this.props.data.mdx.body}
          </MDXRenderer>
        </MDXProvider>
      </Layout>
    );
  }
}

export default NotesPage;
