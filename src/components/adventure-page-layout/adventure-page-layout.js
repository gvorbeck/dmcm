import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../layout/layout';

export const query = graphql`
  query AdventurePageQuery($id: String) {
    mdx(id: {eq: $id}) {
      id
      body
      frontmatter {
        title
        levels
        playernum
        setting
        links {
          url
          title
        }
        image {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
      }
      fields {
        slug
      }
    }
    notes: allMdx(
      filter: {fields: {slug: {regex: "/notes/"}}}
      sort: {fields: frontmatter___title}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
    locations: allMdx(
      filter: {fields: {slug: {regex: "/locations/"}}}
      sort: {fields: frontmatter___title}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
    npcs: allMdx(
      filter: {fields: {slug: {regex: "/npcs/"}}}
      sort: {fields: frontmatter___name}
    ) {
      edges {
        node {
          id
          body
          frontmatter {
            name
            race
            location
            occupation
            age
            emotion
            stats
            motive
            voice
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

function SectionLink(props) {
  if (props.external) {
    return (
      <a
        title={props.data.title}
        target='_blanl'
        rel='noopener noreferrer'
        href={props.data.url}
      >
        {props.data.title}
      </a>
    );
  } else {
    return (
      <h1>{props.data.title} foobar</h1>
    );
  }
}

function AdventureSection(props) {
  return (
    <section>
      <header>
        <h3>{props.title}</h3>
      </header>
      <ul>
        {props.data.map((d, i) => (
          <li key={i}>
            <SectionLink
              data={d}
              external={props.external}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

class AdventurePage extends React.Component {
  render() {
    const sectionData = [
      {
        title: 'Locations',
        data: this.props.data.locations.edges,
      },
      {
        title: 'Notes',
        data: this.props.data.notes.edges,
      },
      {
        title: 'External Links',
        data: this.props.data.mdx.frontmatter.links,
        external: true,
      }
    ];
    const adventureSections = sectionData.map((s, i) => (
      <AdventureSection
        key={i}
        title={s.title}
        data={s.data}
        external={s.external ? true : false}
      />
    ));
    return (
      <Layout>
        <section>
          {this.props.data.mdx.frontmatter.image &&
            <GatsbyImage
              image={getImage(this.props.data.mdx.frontmatter.image)}
              loading="eager"
              alt={this.props.data.mdx.frontmatter.title}
            />
          }
          {this.props.data.mdx.body &&
            <div>
              <MDXProvider>
                <MDXRenderer>{this.props.data.mdx.body}</MDXRenderer>
              </MDXProvider>
            </div>
          }
          <dl>
            {this.props.data.mdx.frontmatter.levels &&
              <React.Fragment>
                <dt>Levels</dt>
                <dd>{this.props.data.mdx.frontmatter.levels}</dd>
              </React.Fragment>
            }
            {this.props.data.mdx.frontmatter.playernum &&
              <React.Fragment>
                <dt>Number of Players</dt>
                <dd>{this.props.data.mdx.frontmatter.playernum}</dd>
              </React.Fragment>
            }
            {this.props.data.mdx.frontmatter.setting &&
              <React.Fragment>
                <dt>Setting</dt>
                <dd>{this.props.data.mdx.frontmatter.setting}</dd>
              </React.Fragment>
            }
          </dl>
        </section>
        <section>{adventureSections}</section>
        <h1>hello world.</h1>
      </Layout>
    );
  }
}

export default AdventurePage;