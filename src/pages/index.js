import React from 'react';
// import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Typography from '@mui/material/Typography';
import Layout from '../components/layout/layout';
import Navigation from '../components/navigation/navigation';
// import * as styles from '../styles/index.module.scss';

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default function IndexPage({ data }) {
  const { title } = data.site.siteMetadata;
  return (
    <Layout title={title} displayNav={false}>
      <Typography variant="h2">Hail fellow well met.</Typography>
      <Navigation />
      <Typography variant="body1">{`The ${title} is a React-based campaign manager for your favorite 5E TTRPG.`}</Typography>
    </Layout>
  );
}

// IndexPage.propTypes = {
//   data: PropTypes.shape({
//     site: PropTypes.shape({
//       siteMetadata: PropTypes.shape({
//         title: PropTypes.string.isRequired,
//       }),
//     }),
//   }).isRequired,
// };

// class IndexPage extends React.Component {
//   render() {
//     return (
//       <Layout
//         className={styles.indexWrapper}
//         homeNav={true}
//       >
//         <h2 className={styles.greeting}>Hail fellow well met.</h2>
//         <Navigation/>
//         <p className={styles.description}>The DMCM is a React-based
// campaign manager for your favorite 5E TTRPG.</p>
//
//         <div className={styles.wizard}/>
//       </Layout>
//     )
//   }
// }
// export default IndexPage;
