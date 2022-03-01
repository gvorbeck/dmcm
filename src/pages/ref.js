/* eslint-disable react/no-array-index-key */
import React from 'react';
import { graphql } from 'gatsby';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Link,
  List,
  ListItem,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import MarkdownView from 'react-showdown';
import Layout from '../components/layout/layout';
import Dice from '../components/dice/dice';

function TableOfContents(tocProps) {
  const { formattedPosts } = tocProps;
  // Create an array of <li>'s containing the category name as a title and every post for
  // that category.
  const toc = formattedPosts.map((obj) => {
    // For each category object in formattedPosts we need to go through its posts array and
    // create the <li>'s that will link to reference article.
    const postList = obj.posts.map((post) => {
      const postData = post.post.node;
      return (
        <Typography variant="body1" component="li" key={postData.id}>
          <Link href={`#${postData.id}`}>{postData.frontmatter.title}</Link>
        </Typography>
      );
    });
    return (
      <ListItem key={Math.random()}>
        <List>
          <ListSubheader component="h3" key={Math.random()}>{obj.category}</ListSubheader>
          {postList}
        </List>
      </ListItem>
    );
  });
  return <List>{toc}</List>;
}

function ArticleList(articleProps) {
  const { articles } = articleProps;
  console.log(articles);
  const articleListMarkup = articles.map((obj) => {
    const articleMarkup = obj.posts.map((articleObj) => {
      const article = articleObj.post.node;
      return (
        <ListItem key={article.id} id={article.id}>
          <Card component="article">
            <CardHeader component="header" titleTypographyProps={{ component: 'h1' }} title={article.frontmatter.title} />
            {article.frontmatter.content && article.frontmatter.content.map((content) => {
              console.log(content.type);
              if (content.type === 'dl') {
                return (
                  <dl key={Math.random()}>
                    {content.terms.map((term) => (
                      <Container key={Math.random()}>
                        <Typography variant="body1" component="dt">{term.dt}</Typography>
                        <Typography variant="body1" component="dd">
                          {term.dd.short && <Box component="span">{term.dd.short}</Box>}
                          {term.dd.cite && <Box component="span">{term.dd.cite}</Box>}
                          {term.dd.text && (
                            <MarkdownView
                              markdown={term.dd.text}
                              components={{ Dice }}
                              options={{ tables: true }}
                            />
                          )}
                        </Typography>
                      </Container>
                    ))}
                  </dl>
                );
              } else if (content.type === 'table') {
                return (
                  <TableContainer key={Math.random()}>
                    <Typography variant="body1" component="h2">{content.title}</Typography>
                    <Table aria-label={content.title}>
                      {content.headers && (
                        <TableHead>
                          <TableRow>
                            {content.headers.map((header) => (
                              <TableCell key={Math.random()}>{header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                      )}
                      {content.rows && (
                        <TableBody>
                          {content.rows.map((row) => (
                            <TableRow key={Math.random()}>
                              {row.length > 0 && row.map((cell) => (
                                <TableCell key={Math.random()}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                );
              } else if (content.type === 'markdown') {
                console.log(content);
                return (
                  <Typography variant="body1" component="div">
                    <MarkdownView
                      key={Math.random()}
                      markdown={content.text}
                      components={{ Dice }}
                    />
                  </Typography>
                );
              }
              return null;
            })}
          </Card>
        </ListItem>
      );
    });
    return (
      <Container key={Math.random()} component="section">
        <Typography variant="body1" component="h4">{obj.category}</Typography>
        <List>{articleMarkup}</List>
      </Container>
    );
  });
  return articleListMarkup;
}

export default function ReferencesPage(props) {
  const { data } = props;
  const posts = data.allMdx.edges;
  const referencesData = [];

  if (posts.length) {
    // We want to create an array of objects. One object for each reference category that
    // contains all the reference posts for that category.
    // example:
    // {
    //  category: 'foo',
    //  posts: [array of post objects matching the category]
    // }
    //
    // For each post sent to the page by the graphql query,
    posts.forEach((post) => {
      // get the posts' category
      const { category } = post.node.frontmatter;
      // then see if the referencesData array has an object for that category already.
      if (referencesData.filter((c) => c.category === category).length > 0) {
        // referencesData already has an object marked for this category's posts so push
        // this post to that category object's posts array:
        //
        // Find the category object within referencesData that matches the category
        const obj = referencesData.find((categoryObject) => (categoryObject.category === category));
        // and push it to that object.
        obj.posts.push({ post });
      } else {
        // referencesData does NOT have an object marked for this category's posts so we'll
        // need to create one AND push the post to it.
        referencesData.push({
          category,
          posts: [{ post }],
        });
      }
    });
  }

  return (
    <Layout title="References">
      <TableOfContents formattedPosts={referencesData} />
      <Container>
        <ArticleList articles={referencesData} />
      </Container>
    </Layout>
  );
}

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
          category
          content {
            type
            terms {
              dt
              dd {
                text
                short
                cite
              }
            }
            title
            headers
            rows
            text
          }
        }
        fields {
          slug
        }
      }
    }
  }
}
`;
// import React from 'react';
// import { graphql, Link } from 'gatsby';
// import AnchorLink from '../components/anchorlink/anchorlink';
// import Dice from '../components/dice/dice';
// import Layout from '../components/layout/layout';
// import showdown from 'showdown';
// import MarkdownView from 'react-showdown';
// import * as styles from '../styles/ref.module.scss';

// export const query = graphql`
//   query ReferenceQuery {
//     allMdx(
//       filter: {fields: {slug: {regex: "/references/"}}}
//       sort: {fields: frontmatter___category}
//     ) {
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             titlenote
//             category
//             content {
//               headers
//               rows
//               text
//               type
//               terms {
//                 cite
//                 short
//                 text
//                 title
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// const converter = new showdown.Converter();

// function ArticleItems(props) {
//   const articles = [];
//   for (let i=0,l=props.articles.length;i<l;i++) {
//     if (props.articles[i].frontmatter.category === props.category) {
//       articles.push(
//         <li
//           key={i}
//           className={styles.articleItem}
//         >
//           <AnchorLink
//             id={encodeURI(props.articles[i].
// frontmatter.title.toLowerCase().replace(/[^0-9a-z]/gi, ''))}
//             style={{
//               position: 'absolute',
//               top: '-47px',
//             }}
//           />
//           <article>
//             <h1 className={styles.articleTitle}>{props.articles[i].frontmatter.title}</h1>
//             {props.articles[i].frontmatter.content &&
//               props.articles[i].frontmatter.content.map((content, i) => {
//                 if (content.type === 'table') {
//                   return (
//                     <div
//                       key={i}
//                       className={`dmcm--text ${styles.content}`}
//                     >
//                       <table>
//                         <thead>
//                           <tr>
//                             {content.headers.map((header, i) => (
//                               <th
//                                 key={i}
//                                 aria-label={header}
//                               >{header}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {content.rows.map((row, i) => (
//                             <tr key={i}>
//                               {row.map((cell, i) => (
//                                 <td key={i} dangerouslySetInnerHTML=
// {{ __html: converter.makeHtml(cell)}}/>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   );
//                 } else if (content.type === 'definitions') {
//                   return (
//                     <div
//                       className={`dmcm--text ${styles.content}`}
//                       key={i}
//                     >
//                       <ul className={styles.definitionItems}>
//                         {content.terms.map((term, i) => (
//                           <li
//                             key={i}
//                             className={styles.definitionItem}
//                           >
//                             <h2 className={styles.definitionTitle}>{term.title}</h2>
//                             <div className={styles.definitionContent}>
//                               {term.short &&
//                                 <p className={styles.short}>{term.short}</p>
//                               }
//                               {term.cite &&
//                                 <p className={styles.cite}>{term.cite}</p>
//                               }
//                               <MarkdownView
//                                 markdown={term.text}
//                                 components={{Dice}}
//                                 options={{ tables: true }}
//                               />
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   );
//                 } else if (content.type === 'markdown') {
//                   return (
//                     <MarkdownView
//                       key={i}
//                       className={`dmcm--text ${styles.content}`}
//                       markdown={content.text}
//                       components={{Dice}}
//                     />
//                   );
//                 }
//                 return ('');
//               })
//             }
//           </article>
//         </li>
//       )
//     }
//   }
//   return articles;
// }

// function Articles(props) {
//   const tocData = tableOfContentsData(props.articles);
//   const refItems = tocData.categories.map((category, i) => (
//     <li
//       key={i}
//       className={styles.categoryItem}
//     >
//       <h4 className={styles.categoryTitle}>
//         <Link to='#toc'>{category}</Link>
//       </h4>
//       <ul className={styles.articleItems}>
//         <ArticleItems
//           articles={tocData.articles}
//           category={category}
//         />
//       </ul>
//     </li>
//   ));
//   return (
//     <section>
//       <ul className={styles.categoryItems}>
//         {refItems}
//       </ul>
//     </section>
//   );
// }

// function tableOfContentsData(articles) {
//   const toc = {
//     categories: [],
//     articles: []
//   }
//   articles.forEach((article) => {
//     if(!toc.categories.includes(article.node.frontmatter.category)) {
//       toc.categories.push(article.node.frontmatter.category);
//       toc.categories.sort();
//     }
//     toc.articles.push(article.node);
//     toc.articles.sort(function (a, b) {
//       const titleA = a.frontmatter.title.toUpperCase();
//       const titleB = b.frontmatter.title.toUpperCase();
//       if (titleA.split(' ')[0] < titleB.split(' ')[0]) {
//         return -1;
//       } else if (titleA.split(' ')[0] > titleB.split(' ')[0]) {
//         return 1;
//       } else {
//         return 0;
//       }
//     });
//   });
//   return toc;
// }

// function TOCListItems(props) {
//   const tocArticleLinks = [];
//   for (let i=0,l=props.articles.length;i<l;i++) {
//     if (props.articles[i].frontmatter.category === props.category) {
//       tocArticleLinks.push(
//         <li key={i}>
//           <Link to={'#' + encodeURI(props.articles[i].
// frontmatter.title.toLowerCase().replace(/[^0-9a-z]/gi, ''))}>
// {props.articles[i].frontmatter.title}</Link>
//         </li>
//       );
//     }
//   }
//   return tocArticleLinks;
// }

// function TableOfContents(props) {
//   const tocData = tableOfContentsData(props.articles);
//   const tocItems = tocData.categories.map((category, i) => (
//     <li key={i}>
//       <h4>{category}</h4>
//       <ul>
//         <TOCListItems
//           articles={tocData.articles}
//           category={category}
//         />
//       </ul>
//     </li>
//   ));
//   return (
//     <section>
//       <AnchorLink id='toc'/>
//       <h3>Table of Contents</h3>
//       <ol className={styles.toc}>
//         {tocItems}
//       </ol>
//     </section>
//   );
// }

// class RefPage extends React.Component {
//   render() {
//     const articles = this.props.data.allMdx.edges;
//     return (
//       <Layout
//         title={'Reference'}
//         className={styles.refWrapper}
//         pageTitle={'Reference: DMCM'}
//       >
//         <TableOfContents
//           articles={articles}
//         />
//         <Articles
//           articles={articles}
//         />
//       </Layout>
//     );
//   }
// }

// export default RefPage;
