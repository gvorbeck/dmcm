import React from 'react';
import { graphql, Link } from 'gatsby';
import showdown from 'showdown';
import AnchorLink from '../components/anchorlink/anchorlink';
import Layout from '../components/layout/layout';

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
      <h3>Table of Contents</h3>
      <ol>
        {tocItems}
      </ol>
    </section>
  );
}

function ArticleItems(props) {
  const articles = [];
  for (let i=0,l=props.articles.length;i<l;i++) {
    if (props.articles[i].frontmatter.category === props.category) {
      articles.push(
        <li key={i}>
          <AnchorLink
            id={encodeURI(props.articles[i].frontmatter.title.toLowerCase().replace(/[^0-9a-z]/gi, ''))}
          />
          <article>
            <header>
              <h1>{props.articles[i].frontmatter.title}</h1>
            </header>
            <div>
              {props.articles[i].frontmatter.content &&
                props.articles[i].frontmatter.content.map((content, i) => {
                  if (content.type === 'table') {
                    return (
                      <table
                        key={i}
                      >
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
                                <td key={i}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  } else if (content.type === 'definitions') {
                    return (
                      <ul key={i}>
                        {content.terms.map((term, i) => (
                          <li key={i}>
                            <div>
                              <h2>{term.title}</h2>
                              <p>{term.short}</p>
                              <p>{term.cite}</p>
                            </div>
                            <div
                              dangerouslySetInnerHTML={{ __html: converter.makeHtml(term.text) }}
                            />
                          </li>
                        ))}
                      </ul>
                    );
                  } else if (content.type === 'markdown') {
                    return (
                      <div
                        key={i}
                        dangerouslySetInnerHTML={{ __html: converter.makeHtml(content.text) }}
                      />
                    );
                  }
                  return ('');
                })
              }
            </div>
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
    <li key={i}>
      <h4>
        <span>{i + 1}.</span> {category}</h4>
      <ul>
        <ArticleItems
          articles={tocData.articles}
          category={category}
        />
      </ul>
    </li>
  ));
  return (
    <section>
      <ul>
        {refItems}
      </ul>
    </section>
  );
}

class RefPage extends React.Component {
  render() {
    const articles = this.props.data.allMdx.edges;
    return (
      <Layout>
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
