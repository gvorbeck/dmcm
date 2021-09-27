import React from 'react';
import { graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../layout/layout';
import * as styles from './adventure-page-layout.module.scss';

export const query = graphql`
  query AdventurePageQuery($id: String, $locations: String, $notes: String, $npcs: String) {
    mdx(id: {eq: $id}) {
      id
      body
      frontmatter {
        title
        icon
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
      filter: {fields: {slug: {regex: $notes}}}
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
      filter: {fields: {slug: {regex: $locations}}}
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
      filter: {fields: {slug: {regex: $npcs}}}
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
        target='_blank'
        rel='noopener noreferrer'
        href={props.data.url}
      >
        {props.data.title}
      </a>
    );
  } else {
    return (
      <Link to={props.data.node.fields.slug}>{props.data.node.frontmatter.title}</Link>
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

function npcDataRow(npc, column) {
  if (column ==='stats') {
    return (
      <a
        title='Stat Block'
        href={npc[column]}
        target='_blank'
        rel='noopener noreferrer'
      >
        <span/>
      </a>
    );
  } else if (column === 'detail') {
    return (
      <button
        aria-label='NPC Details'
      />
    );
  } else {
    return (npc[column]);
  }
};

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
    ],
    adventureSections = sectionData.map((s, i) => (
      <AdventureSection
        key={i}
        title={s.title}
        data={s.data}
        external={s.external ? true : false}
      />
    )),
    tableColumnNames = ["name", "race", "location", "occupation", "age", "stats", "emotion", "motive", "voice", "detail"],
    tableColumns = tableColumnNames.map((c, i) => (
      <th
        key={i}
        aria-label={c}
        dangerouslySetInnerHTML={{ __html: c }}
      />
    )),
    tableRows = [];

    for (let i=0,l=this.props.data.npcs.edges.length;i<l;i++) {
      const tableCell = [];
      for (let x=0,y=tableColumnNames.length;x<y;x++) {
        tableCell.push(
          <td key={x}>{npcDataRow(this.props.data.npcs.edges[i].node.frontmatter, tableColumnNames[x])}</td>
        );
      }
      tableRows.push(
        <React.Fragment key={i}>
          <tr>{tableCell}</tr>
          <tr>
            <td colSpan='100%'>
              <div className={styles.notes}>
                <MDXProvider>
                  <MDXRenderer>
                    {this.props.data.npcs.edges[i].node.body}
                  </MDXRenderer>
                </MDXProvider>
              </div>
            </td>
          </tr>
        </React.Fragment>
      );
    };

    return (
      <Layout
        title={this.props.data.mdx.frontmatter.title}
        className={styles.adventureWrapper}
        icon={this.props.data.mdx.frontmatter.icon + ' dmcm--adventure-icon'}
        pageTitle={this.props.data.mdx.frontmatter.title + ': DMCM'}
      >
        <div className={styles.container}>
          <section className={styles.details}>
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
          <section className={styles.links}>
            {adventureSections}
          </section>
          {this.props.data.npcs &&
            <table className={styles.npcs}>
              <thead>
                <tr>
                  {tableColumns}
                </tr>
              </thead>
              <tbody>
                {tableRows}
              </tbody>
            </table>
          }
        </div>
      </Layout>
    );
  }
}

export default AdventurePage;
