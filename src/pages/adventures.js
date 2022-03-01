import React from 'react';
import { graphql } from 'gatsby';
// import Container from '@mui/material/Container';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Layout from '../components/layout/layout';

export default function AdventuresPage(props) {
  const { data } = props;
  const posts = data.allMdx.edges;

  const adventurePost = (adventure) => {
    const { node } = adventure;
    return (
      <ListItem key={node.id}>
        <Card component="article">
          <CardHeader component="header" titleTypographyProps={{ component: 'h1' }} title={<Link href={node.fields.slug}>{node.frontmatter.title}</Link>} />
          <CardContent>
            <Container component="dl">
              {node.frontmatter.setting && (
                <>
                  <Typography variant="body2" component="dt">setting</Typography>
                  <Typography variant="body2" component="dt">{node.frontmatter.setting}</Typography>
                </>
              )}
              {node.frontmatter.levels && (
                <>
                  <Typography variant="body2" component="dt">levels</Typography>
                  <Typography variant="body2" component="dt">{node.frontmatter.levels}</Typography>
                </>
              )}
              {node.frontmatter.playernum && (
                <>
                  <Typography variant="body2" component="dt">players</Typography>
                  <Typography variant="body2" component="dt">{node.frontmatter.playernum}</Typography>
                </>
              )}
            </Container>
            <Typography variant="body1" component="div">
              <MDXProvider>
                <MDXRenderer>
                  {node.body}
                </MDXRenderer>
              </MDXProvider>
            </Typography>
          </CardContent>
        </Card>
      </ListItem>
    );
  };

  const adventureList = (adventures) => {
    const adventureArray = [];
    adventures.forEach((a) => {
      adventureArray.push(adventurePost(a));
    });
    return adventureArray;
  };

  return (
    <Layout title="adventures">
      <Container component="section">
        <List>{adventureList(posts)}</List>
      </Container>
    </Layout>
  );
}

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
`;

// import React from 'react';
// import { graphql, Link } from 'gatsby';
// import { MDXProvider } from '@mdx-js/react';
// import { MDXRenderer } from 'gatsby-plugin-mdx';
// import IconShield from '../components/icons/shield/shield';
// import Layout from '../components/layout/layout';
// import * as styles from '../styles/adventures.module.scss';

// export const query = graphql`
//   query AdventuresListPageQuery {
//     allMdx(
//       filter: {slug: {regex: "/adventures/.+/$/"}}
//       sort: {fields: frontmatter___title}
//     ) {
//       edges {
//         node {
//           id
//           frontmatter {
//             title
//             setting
//             levels
//             playernum
//           }
//           fields {
//             slug
//           }
//           body
//         }
//       }
//     }
//   }
// `

// function AdventureItem(props) {
//   return (
//     <article className={props.className}>
//       <IconShield/>
//       <h1>
//         <Link to={props.slug}>{props.title}</Link>
//       </h1>
//       <div>
//         <dl>
//           <dt>Setting</dt>
//           <dd>{props.setting}</dd>
//           <dt>Levels</dt>
//           <dd>{props.levels}</dd>
//           <dt>Number of Players</dt>
//           <dd>{props.playernum}</dd>
//         </dl>
//         <div className={styles.description}>
//           <MDXProvider>
//             <MDXRenderer>
//               {props.description}
//             </MDXRenderer>
//           </MDXProvider>
//         </div>
//       </div>
//     </article>
//   );
// }

// class AdventuresListPage extends React.Component {
//   render() {
//     const adventureList = this.props.data.allMdx.edges.map((a, i) => (
//       <li key={i}>
//         <AdventureItem
//           slug={a.node.fields.slug}
//           title={a.node.frontmatter.title}
//           setting={a.node.frontmatter.setting}
//           levels={a.node.frontmatter.levels}
//           playernum={a.node.frontmatter.playernum}
//           description={a.node.body}
//           className={styles.adventureItem}
//         />
//       </li>
//     ));
//     return (
//       <Layout
//         className={styles.adventuresWrapper}
//         title='Adventures'
//         pageTitle={'Adventures: DMCM'}
//       >
//         <ul className={styles.adventureList}>{adventureList}</ul>
//       </Layout>
//     )
//   }
// }

// export default AdventuresListPage;
