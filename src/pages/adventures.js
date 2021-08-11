import React from 'react';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout/layout';

export const query = graphql`
  query AdventuresListPageQuery {
    allMdx(
      filter: {slug: {regex: "/adventures/.+/$/"}}
      sort: {fields: frontmatter___title}
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            setting
            levels
            playernum
          }
          fields {
            slug
          }
          body
        }
      }
    }
  }
`

function AdventureItem(props) {
  return (
    <article>
      <h1>
        <Link to={props.slug}>{props.title}</Link>
      </h1>
      <MDXProvider>
        <MDXRenderer>
          {props.description}
        </MDXRenderer>
      </MDXProvider>
      <dl>
        <dt>Setting</dt>
        <dd>{props.setting}</dd>
        <dt>Levels</dt>
        <dd>{props.levels}</dd>
        <dt>Number of Players</dt>
        <dd>{props.playernum}</dd>
      </dl>
    </article>
  );
}

class AdventuresListPage extends React.Component {
  render() {
    const adventureList = this.props.data.allMdx.edges.map((a, i) => (
      <li key={i}>
        <AdventureItem
          slug={a.node.fields.slug}
          title={a.node.frontmatter.title}
          setting={a.node.frontmatter.setting}
          levels={a.node.frontmatter.levels}
          playernum={a.node.frontmatter.playernum}
          description={a.node.body}
        />
      </li>
    ));
    console.log(this.props.data.allMdx.edges);
    return (
      <Layout>
        <ul>{adventureList}</ul>
      </Layout>
    )
  }
}

export default AdventuresListPage;