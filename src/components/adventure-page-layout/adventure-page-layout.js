import React from 'react';
import { graphql } from 'gatsby';
// import MarkdownView from 'react-showdown';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import {
  Box,
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
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import Layout from '../layout/layout';

function EnhancedTableHead(props) {
  const {
    order, orderBy, onRequestSort, headers,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map((cell) => (
          <TableCell
            key={Math.random()}
            align={cell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === cell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={orderBy === cell.id ? order : 'asc'}
              onClick={createSortHandler(cell.id)}
            >
              {cell.label}
              {orderBy === cell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function NpcTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { headerCells, npcData } = props;
  const rows = npcData.map((row) => row.node.frontmatter);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const descendingComparator = (a, b) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  const getComparator = () => (
    order === 'desc'
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b)
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headers={headerCells}
          />
          <TableBody>
            {rows.slice().sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.name}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.race}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.occupation}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell>{row.stats}</TableCell>
                  <TableCell>{row.emotion}</TableCell>
                  <TableCell>{row.motive}</TableCell>
                  <TableCell>{row.voice}</TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 75 * emptyRows,
                }}
              >
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default function AdventurePage(props) {
  const { data } = props;

  const headerCells = [
    {
      id: 'name',
      numeric: false,
      label: 'Name',
    },
    {
      id: 'race',
      numeric: false,
      label: 'Race',
    },
    {
      id: 'location',
      numeric: false,
      label: 'Location',
    },
    {
      id: 'occupation',
      numeric: false,
      label: 'Job',
    },
    {
      id: 'age',
      numeric: true,
      label: 'Age',
    },
    {
      id: 'stats',
      numeric: false,
      label: 'Stats',
    },
    {
      id: 'emotion',
      numeric: false,
      label: 'Emotion',
    },
    {
      id: 'motive',
      numeric: false,
      label: 'Motive',
    },
    {
      id: 'voice',
      numeric: false,
      label: 'Voice',
    },
  ];

  const metadata = (frontmatter) => {
    const chip = (title, value) => (
      <>
        <dt>{title}</dt>
        <dd>{value}</dd>
      </>
    );

    return (
      frontmatter && (
        <dl>
          {frontmatter.levels && (chip('levels', frontmatter.levels))}
          {frontmatter.playernum && (chip('players', frontmatter.playernum))}
          {frontmatter.setting && (chip('setting', frontmatter.setting))}
        </dl>
      )
    );
  };

  const bodyParts = (body, frontmatter) => (
    <>
      <MDXProvider>
        <MDXRenderer>
          {body}
        </MDXRenderer>
      </MDXProvider>
      {metadata(frontmatter)}
    </>
  );

  const locationListItems = (locations) => {
    const locationMarkup = locations && locations.map((location) => {
      const { title } = location.node.frontmatter;
      const { slug } = location.node.fields;
      return (
        <Typography key={Math.random()} variant="body1" component={ListItem}>
          <Link href={slug}>{title}</Link>
        </Typography>
      );
    });
    return locationMarkup;
  };

  return (
    <Layout title={data.mdx.frontmatter.title}>
      {/* Adventure basic info */}
      <Typography
        variant="body1"
        component={Container}
      >
        {bodyParts(data.mdx.body, data.mdx.frontmatter)}
      </Typography>

      {/* NPC Table */}
      <NpcTable
        npcData={data.npcs.edges}
        headerCells={headerCells}
      />

      {/* Location links */}
      <List
        subheader={(
          <ListSubheader
            component="h3"
            id="locations"
          >
            Locations
          </ListSubheader>
        )}
      >
        {locationListItems(data.locations.edges)}
      </List>
    </Layout>
  );
}

export const query = graphql`
  query AdventurePageQuery($id: String, $locations: String, $npcs: String) {
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
`;

// import React from 'react';
// import { graphql, Link } from 'gatsby';
// import { MDXProvider } from '@mdx-js/react'
// import { MDXRenderer } from 'gatsby-plugin-mdx'
// import Layout from '../layout/layout';
// import * as styles from './adventure-page-layout.module.scss';

// export const query = graphql`
//   query AdventurePageQuery($id: String, $locations: String, $notes: String, $npcs: String) {
//     mdx(id: {eq: $id}) {
//       id
//       body
//       frontmatter {
//         title
//         icon
//         levels
//         playernum
//         setting
//         links {
//           url
//           title
//         }
//         image {
//           childImageSharp {
//             gatsbyImageData(placeholder: BLURRED)
//           }
//         }
//       }
//       fields {
//         slug
//       }
//     }
//     notes: allMdx(
//       filter: {fields: {slug: {regex: $notes}}}
//       sort: {fields: frontmatter___title}
//     ) {
//       edges {
//         node {
//           frontmatter {
//             title
//           }
//           fields {
//             slug
//           }
//         }
//       }
//     }
//     locations: allMdx(
//       filter: {fields: {slug: {regex: $locations}}}
//       sort: {fields: frontmatter___title}
//     ) {
//       edges {
//         node {
//           frontmatter {
//             title
//           }
//           fields {
//             slug
//           }
//         }
//       }
//     }
//     npcs: allMdx(
//       filter: {fields: {slug: {regex: $npcs}}}
//       sort: {fields: frontmatter___name}
//     ) {
//       edges {
//         node {
//           id
//           body
//           frontmatter {
//             name
//             race
//             location
//             occupation
//             age
//             emotion
//             stats
//             motive
//             voice
//           }
//           fields {
//             slug
//           }
//         }
//       }
//     }
//   }
// `

// function SectionLink(props) {
//   if (props.external) {
//     return (
//       <a
//         title={props.data.title}
//         target='_blank'
//         rel='noopener noreferrer'
//         href={props.data.url}
//       >
//         {props.data.title}
//       </a>
//     );
//   } else {
//     return (
//       <Link to={props.data.node.fields.slug}>{props.data.node.frontmatter.title}</Link>
//     );
//   }
// }

// function AdventureSection(props) {
//   return (
//     <section>
//       <header>
//         <h3>{props.title}</h3>
//       </header>
//       <ul>
//         {props.data.map((d, i) => (
//           <li key={i}>
//             <SectionLink
//               data={d}
//               external={props.external}
//             />
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

// function npcDataRow(npc, column) {
//   if (column ==='stats') {
//     return (
//       <a
//         title='Stat Block'
//         href={npc[column]}
//         target='_blank'
//         rel='noopener noreferrer'
//       >
//         <span/>
//       </a>
//     );
//   } else if (column === 'detail') {
//     return (
//       <button
//         aria-label='NPC Details'
//       />
//     );
//   } else {
//     return (npc[column]);
//   }
// };

// class AdventurePage extends React.Component {
//   render() {
//     const sectionData = [
//       {
//         title: 'Locations',
//         data: this.props.data.locations.edges,
//       },
//       {
//         title: 'Notes',
//         data: this.props.data.notes.edges,
//       },
//       {
//         title: 'External Links',
//         data: this.props.data.mdx.frontmatter.links,
//         external: true,
//       }
//     ],
//     adventureSections = sectionData.map((s, i) => (
//       <AdventureSection
//         key={i}
//         title={s.title}
//         data={s.data}
//         external={s.external ? true : false}
//       />
//     )),
//     tableColumnNames = ["name", "race", "location",
// "occupation", "age", "stats", "emotion", "motive", "voice", "detail"],
//     tableColumns = tableColumnNames.map((c, i) => (
//       <th
//         key={i}
//         aria-label={c}
//         dangerouslySetInnerHTML={{ __html: c }}
//       />
//     )),
//     tableRows = [];

//     for (let i=0,l=this.props.data.npcs.edges.length;i<l;i++) {
//       const tableCell = [];
//       for (let x=0,y=tableColumnNames.length;x<y;x++) {
//         tableCell.push(
//           <td key={x}>{npcDataRow(this.props.data.npcs.
// edges[i].node.frontmatter, tableColumnNames[x])}</td>
//         );
//       }
//       tableRows.push(
//         <React.Fragment key={i}>
//           <tr>{tableCell}</tr>
//           <tr>
//             <td colSpan='100%'>
//               <div className={styles.notes}>
//                 <MDXProvider>
//                   <MDXRenderer>
//                     {this.props.data.npcs.edges[i].node.body}
//                   </MDXRenderer>
//                 </MDXProvider>
//               </div>
//             </td>
//           </tr>
//         </React.Fragment>
//       );
//     };

//     return (
//       <Layout
//         title={this.props.data.mdx.frontmatter.title}
//         className={styles.adventureWrapper}
//         icon={this.props.data.mdx.frontmatter.icon + ' dmcm--adventure-icon'}
//         pageTitle={this.props.data.mdx.frontmatter.title + ': DMCM'}
//       >
//         <div className={styles.container}>
//           <section className={styles.details}>
//             {this.props.data.mdx.body &&
//               <div>
//                 <MDXProvider>
//                   <MDXRenderer>{this.props.data.mdx.body}</MDXRenderer>
//                 </MDXProvider>
//               </div>
//             }
//             <dl>
//               {this.props.data.mdx.frontmatter.levels &&
//                 <React.Fragment>
//                   <dt>Levels</dt>
//                   <dd>{this.props.data.mdx.frontmatter.levels}</dd>
//                 </React.Fragment>
//               }
//               {this.props.data.mdx.frontmatter.playernum &&
//                 <React.Fragment>
//                   <dt>Number of Players</dt>
//                   <dd>{this.props.data.mdx.frontmatter.playernum}</dd>
//                 </React.Fragment>
//               }
//               {this.props.data.mdx.frontmatter.setting &&
//                 <React.Fragment>
//                   <dt>Setting</dt>
//                   <dd>{this.props.data.mdx.frontmatter.setting}</dd>
//                 </React.Fragment>
//               }
//             </dl>
//           </section>
//           <section className={styles.links}>
//             {adventureSections}
//           </section>
//           {this.props.data.npcs &&
//             <table className={styles.npcs}>
//               <thead>
//                 <tr>
//                   {tableColumns}
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableRows}
//               </tbody>
//             </table>
//           }
//         </div>
//       </Layout>
//     );
//   }
// }

// export default AdventurePage;
