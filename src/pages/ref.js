import React from 'react';
import { graphql, Link } from 'gatsby';
import AnchorLink from '../components/anchorlink/anchorlink';
import Dice from '../components/dice/dice';
import Layout from '../components/layout/layout';
import showdown from 'showdown';
import MarkdownView from 'react-showdown';
import * as styles from '../styles/ref.module.scss';

export const query = graphql`
  query ReferenceQuery {
    allMdx(
      filter: {fields: {slug: {regex: "/references/"}}}
      sort: {fields: frontmatter___category}
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            titlenote
            category
            content {
              headers
              rows
              text
              type
              terms {
                cite
                short
                text
                title
              }
            }
          }
        }
      }
    }
  }
`
const converter = new showdown.Converter();

function ArticleItems(props) {
  const articles = [];
  for (let i=0,l=props.articles.length;i<l;i++) {
    if (props.articles[i].frontmatter.category === props.category) {
      articles.push(
        <li 
          key={i}
          className={styles.articleItem}
        >
          <AnchorLink
            id={encodeURI(props.articles[i].frontmatter.title.toLowerCase().replace(/[^0-9a-z]/gi, ''))}
            style={{
              position: 'absolute',
              top: '-47px',
            }}
          />
          <article>
            <h1 className={styles.articleTitle}>{props.articles[i].frontmatter.title}</h1>
            {props.articles[i].frontmatter.content &&
              props.articles[i].frontmatter.content.map((content, i) => {
                if (content.type === 'table') {
                  return (
                    <div
                      key={i}
                      className={`dmcm--text ${styles.content}`}
                    >
                      <table>
                        <thead>
                          <tr>
                            {content.headers.map((header, i) => (
                              <th
                                key={i}
                                aria-label={header}
                              >{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {content.rows.map((row, i) => (
                            <tr key={i}>
                              {row.map((cell, i) => (
                                <td key={i} dangerouslySetInnerHTML={{ __html: converter.makeHtml(cell)}}/>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } else if (content.type === 'definitions') {
                  return (
                    <div
                      className={`dmcm--text ${styles.content}`}
                      key={i}
                    >
                      <ul className={styles.definitionItems}>
                        {content.terms.map((term, i) => (
                          <li
                            key={i}
                            className={styles.definitionItem}
                          >
                            <h2 className={styles.definitionTitle}>{term.title}</h2>
                            <div className={styles.definitionContent}>
                              {term.short &&
                                <p className={styles.short}>{term.short}</p>
                              }
                              {term.cite &&
                                <p className={styles.cite}>{term.cite}</p>
                              }
                              <MarkdownView
                                markdown={term.text}
                                components={{Dice}}
                                options={{ tables: true }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                } else if (content.type === 'markdown') {
                  return (
                    <MarkdownView
                      key={i}
                      className={`dmcm--text ${styles.content}`}
                      markdown={content.text}
                      components={{Dice}}
                    />
                  );
                }
                return ('');
              })
            }
          </article>
        </li>
      )
    }
  }
  return articles;
}

function Articles(props) {
  const tocData = tableOfContentsData(props.articles);
  const refItems = tocData.categories.map((category, i) => (
    <li
      key={i}
      className={styles.categoryItem}
    >
      <h4 className={styles.categoryTitle}>
        <Link to='#toc'>{category}</Link>
      </h4>
      <ul className={styles.articleItems}>
        <ArticleItems
          articles={tocData.articles}
          category={category}
        />
      </ul>
    </li>
  ));
  return (
    <section>
      <ul className={styles.categoryItems}>
        {refItems}
      </ul>
    </section>
  );
}

function tableOfContentsData(articles) {
  const toc = {
    categories: [],
    articles: []
  }
  articles.forEach((article) => {
    if(!toc.categories.includes(article.node.frontmatter.category)) {
      toc.categories.push(article.node.frontmatter.category);
      toc.categories.sort();
    }
    toc.articles.push(article.node);
    toc.articles.sort(function (a, b) {
      const titleA = a.frontmatter.title.toUpperCase();
      const titleB = b.frontmatter.title.toUpperCase();
      if (titleA.split(' ')[0] < titleB.split(' ')[0]) {
        return -1;
      } else if (titleA.split(' ')[0] > titleB.split(' ')[0]) {
        return 1;
      } else {
        return 0;
      }
    });
  });
  return toc;
}

function TOCListItems(props) {
  const tocArticleLinks = [];
  for (let i=0,l=props.articles.length;i<l;i++) {
    if (props.articles[i].frontmatter.category === props.category) {
      tocArticleLinks.push(
        <li key={i}>
          <Link to={'#' + encodeURI(props.articles[i].frontmatter.title.toLowerCase().replace(/[^0-9a-z]/gi, ''))}>{props.articles[i].frontmatter.title}</Link>
        </li>
      );
    }
  }
  return tocArticleLinks;
}

function TableOfContents(props) {
  const tocData = tableOfContentsData(props.articles);
  const tocItems = tocData.categories.map((category, i) => (
    <li key={i}>
      <h4>{category}</h4>
      <ul>
        <TOCListItems
          articles={tocData.articles}
          category={category}
        />
      </ul>
    </li>
  ));
  return (
    <section>
      <AnchorLink id='toc'/>
      <h3>Table of Contents</h3>
      <ol className={styles.toc}>
        {tocItems}
      </ol>
    </section>
  );
}

class RefPage extends React.Component {
  render() {
    const articles = this.props.data.allMdx.edges;
    return (
      <Layout
        title={'Reference'}
        className={styles.refWrapper}
        pageTitle={'Reference: DMCM'}
      >
        <TableOfContents
          articles={articles}
        />
        <Articles
          articles={articles}
        />
      </Layout>
    );
  }
}

export default RefPage;
