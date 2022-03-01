import React from 'react';
import { graphql } from 'gatsby';
import {
  Box,
  Typography,
} from '@mui/material';
import Layout from '../components/layout/layout';
import Navigation from '../components/navigation/navigation';
// import themer from '../components/themer/themer';

// const theme = themer();

// const theme = (theme) ;
// console.log(theme);

export default function IndexPage(props) {
  const { data } = props;
  const { title } = data.site.siteMetadata;
  // console.log(theme);
  return (
    <Layout title={title} displayNav={false}>
      <Box
        // color={(theme) => theme.pallette.tertiary.main}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, auto)',
          gridColumnGap: '2rem',
        }}
      >
        <Typography
          variant="h1"
          component="h2"
          sx={{
            fontWeight: 500,
            gridColumn: '1 / 3',
          }}
        >
          Hail fellow well met.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            gridColumn: '1 / 3',
            gridRow: '2 / 3',
            mt: 2,
          }}
        >
          {`The ${title} is a React-based campaign manager for your favorite 5E TTRPG.`}
        </Typography>
        <Navigation
          navDir="column"
          sx={{
            gridColumn: '3 / 4',
            gridRow: '1 / 3',
            justifyContent: 'space-between',
            height: '100%',
          }}
          color="tertiary"
          size="large"
          fontWeight={700}
          fullWidth
        />
      </Box>
    </Layout>
  );
}

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

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
