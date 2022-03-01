import React, { useEffect } from 'react';
import { graphql, navigate } from 'gatsby';
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  Info,
  Map,
} from '@mui/icons-material';
// import { AiFillQuestionCircle } from 'react-icons';
import {
  GiBullyMinion,
  GiEvilMinion,
  GiOpenTreasureChest,
  GiPerson,
  GiPerspectiveDiceSixFacesRandom,
  GiSecretDoor,
  GiSixEyes,
  GiWolfTrap,
} from 'react-icons/gi';
import MarkdownView from 'react-showdown';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../layout/layout';

function Iconizer(props) {
  const { icon } = props;
  const iconSwitch = icon ? icon.toUpperCase() : null;
  let iconReturned;
  switch (iconSwitch) {
    case ('GIPERSON'):
      iconReturned = (
        <Tooltip title="Person of Interest">
          <Button><GiPerson /></Button>
        </Tooltip>
      );
      break;
    case ('GISIXEYES'):
      iconReturned = (
        <Tooltip title="NPCs are observing">
          <Button><GiSixEyes /></Button>
        </Tooltip>
      );
      break;
    case ('GIWOLFTRAP'):
      iconReturned = (
        <Tooltip title="Traps present">
          <Button><GiWolfTrap /></Button>
        </Tooltip>
      );
      break;
    case ('GIBULLYMINION'):
      iconReturned = (
        <Tooltip title="Boss Villain present">
          <Button><GiBullyMinion /></Button>
        </Tooltip>
      );
      break;
    case ('GISECRETDOOR'):
      iconReturned = <GiSecretDoor />;
      break;
    case ('GIEVILMINION'):
      iconReturned = <GiEvilMinion />;
      break;
    case ('GIOPENTREASURECHEST'):
      iconReturned = <GiOpenTreasureChest />;
      break;
    default:
      iconReturned = <GiPerspectiveDiceSixFacesRandom />;
      break;
  }
  return iconReturned;
}

function LocationNavigator(props) {
  const { navLocation, setNavLocation, locationMax } = props;

  useEffect(() => {
    if (navLocation !== '') {
      navigate(`#${navLocation}`, { replace: true });
    }
    if (navLocation === '') {
      navigate('', { replace: true });
    }
  }, [navLocation]);

  const handleNavItemClick = (anchor) => {
    switch (anchor) {
      case 'up':
        if (typeof navLocation === 'string') {
          if (navLocation === 'general') {
            setNavLocation('map');
            break;
          } else if (navLocation === 'map') {
            setNavLocation('');
            break;
          } else if (navLocation === '') {
            break;
          }
          setNavLocation(1);
          break;
        }
        if (typeof navLocation === 'number') {
          setNavLocation(navLocation - 1);
        }
        break;
      case 'down':
        if (typeof navLocation === 'string') {
          if (navLocation === 'general') {
            setNavLocation(1);
            break;
          } else if (navLocation === 'map') {
            setNavLocation('general');
            break;
          } else if (navLocation === '') {
            setNavLocation('map');
            break;
          }
          setNavLocation(1);
          break;
        }
        if (typeof navLocation === 'number') {
          if (navLocation + 1 <= locationMax) {
            setNavLocation(navLocation + 1);
          }
        }
        break;
      case 'map':
      case 'general':
      default:
        setNavLocation(anchor);
    }
  };

  const icons = [
    {
      name: 'map',
      anchor: 'map',
      icon: <Map />,
    },
    {
      name: 'general info',
      anchor: 'general',
      icon: <Info />,
    },
    {
      name: 'up',
      anchor: 'up',
      icon: <ArrowUpward />,
    },
    {
      name: 'down',
      anchor: 'down',
      icon: <ArrowDownward />,
    },
  ];
  const navItems = icons.map((item) => (
    <Tooltip
      title={item.name}
      key={item.name}
    >
      <ListItemButton
        component="li"
        onClick={() => handleNavItemClick(item.anchor)}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
      </ListItemButton>
    </Tooltip>
  ));

  return (
    <Box component="nav">
      <List>
        {navItems}
      </List>
    </Box>
  );
}

function LocationMap(props) {
  const {
    title,
    image,
    map,
    areas,
  } = props;
  const screenFrame = (map && map.image && map.width && map.height && map.padding)
    ? {
      p: map.padding,
      gridTemplateColumns: `repeat(${map.width}, 1fr)`,
      gridTemplateRows: `repeat(${map.height}, 1fr)`,
    }
    : null;
  const trapMapListItems = areas.map((area) => {
    if (area.traps) {
      return area.traps.map((trap) => {
        const coordinates = {
          griedColumnStart: trap.x,
          gridColumnEnd: trap.x + trap.w,
          gridRowStart: trap.y,
          gridRowEnd: trap.y + trap.h,
        };
        return (
          <ListItem
            key={((trap.x % trap.y) * trap.w) % (trap.h)}
            sx={coordinates}
            className="dmcm-ListItem-trap"
          />
        );
      });
    }
    return null;
  });
  const areaMapListItems = areas.map((area, index) => {
    const coordinates = {
      gridColumnStart: area.x,
      gridRowStart: area.y,
    };
    return (
      <ListItem
        key={`${area.name}-${area.x}-${area.y}`}
        sx={coordinates}
      >
        <Box>
          <Typography variant="body1" component="p">{area.name}</Typography>
          {area.flags && (
            <List>
              {area.flags.map((flag) => (
                <ListItem key={flag}>
                  <Iconizer icon={flag} />
                </ListItem>
              ))}
            </List>
          )}
          <Link href={`#${index + 1}`}>{index + 1}</Link>
        </Box>
      </ListItem>
    );
  });
  return (
    <Box>
      <GatsbyImage
        image={image}
        loading="eager"
        alt={`Map of ${title}`}
      />
      <List sx={screenFrame}>
        {areaMapListItems}
        {trapMapListItems}
      </List>
    </Box>
  );
}

function LocationAreaNotes(props) {
  const { areas } = props;

  const areaNoteListItems = areas && areas.map((area, index) => {
    console.log(area);
    return (
      <ListItem key={area.name} id={`${index + 1}`}>
        <Box component="article">
          <Box component="header">
            <Typography variant="body1" component="span">{index + 1}</Typography>
            <Typography variant="body1" component="h1">{area.name}</Typography>
          </Box>
          <Box>
            {area.flavor && <MarkdownView markdown={area.flavor} />}
            {area.callout && <MarkdownView markdown={area.callout} />}
            {area.content && <MarkdownView markdown={area.content} />}
          </Box>
        </Box>
      </ListItem>
    );
  });

  console.log(areas);
  return (
    <List component="ol">
      {areaNoteListItems}
    </List>
  );
}

export default function LocationPage(props) {
  const { data, location } = props;
  const [navLocation, setNavLocation] = React.useState(location.hash.substring(1));
  const { frontmatter } = data.mdx;
  console.log(data);

  return (
    <Layout title={frontmatter.title}>
      {/* Location Navigation */}
      <LocationNavigator
        navLocation={navLocation}
        setNavLocation={setNavLocation}
        locationMax={frontmatter.areas.length}
      />
      <Box id="map">
        <LocationMap
          image={getImage(frontmatter.map.image)}
          map={frontmatter.map}
          title={frontmatter.title}
          areas={frontmatter.areas}
        />
      </Box>
      <Box id="general">
        this is the general area.
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </Box>
      <Box>
        this is where the areas will be listed.is this getting better? hi. hi
        <LocationAreaNotes areas={frontmatter.areas} />
      </Box>
    </Layout>
  );
}

export const query = graphql`
query ($id: String, $pid: String) {
  mdx(id: {eq: $id}) {
    id
    body
    fields {
      slug
    }
    frontmatter {
      title
      areas {
        flavor
        callout
        content
        name
        x
        y
        flags
        traps {
          x
          y
          h
          w
        }
      }
      map {
        image {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
          }
        }
        width
        height
        padding
      }
    }
  }
  adventure: mdx(id: {eq: $pid}) {
    slug
    frontmatter {
      title
      players {
        class
        name
        passiveperception
        race
      }
    }
  }
}
`;

// eslint-disable-next-line no-lone-blocks
{ /*
==========================================================================================
// import React from 'react';
// import { graphql, Link } from 'gatsby';
// import { navigate } from '@reach/router';
// import { GatsbyImage, getImage } from 'gatsby-plugin-image';
// import AnchorLink from '../anchorlink/anchorlink';
// import Dice from '../dice/dice';
// import Layout from '../layout/layout';
// import { SpellLink, MonsterLink } from '../int-link/int-link';
// import { MDXProvider } from '@mdx-js/react';
// import { MDXRenderer } from 'gatsby-plugin-mdx';
// import showdown from 'showdown';
// import MarkdownView from 'react-showdown';
// import * as styles from './location-page-layout.module.scss';

// export const query = graphql`
// query ($id: String, $pid: String) {
//   mdx(id: {eq: $id}) {
//     id
//     body
//     fields {
//       slug
//     }
//     frontmatter {
//       title
//       areas {
//         flavor
//         callout
//         content
//         name
//         x
//         y
//         flags
//         traps {
//           x
//           y
//           h
//           w
//         }
//       }
//       map {
//         image {
//           childImageSharp {
//             gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
//           }
//         }
//         width
//         height
//         padding
//       }
//     }
//   }
//   adventure: mdx(id: {eq: $pid}) {
//     slug
//     frontmatter {
//       title
//       players {
//         class
//         name
//         passiveperception
//         race
//       }
//     }
//   }
// }
// `
// const converter = new showdown.Converter();
// const shortcodes = { Dice };

// function Navigation(props) {
//   const navItemsData = [
//     {
//       title: 'Back to ' + props.adventureTitle,
//       url: props.adventure,
//       content: `&lt;`,
//     },
//     {
//       title: 'Map',
//       url: '#map',
//       content: ' ',
//       class: 'game-icon game-icon-treasure-map'
//     },
//     {
//       title: 'General Features',
//       url: '#general',
//       content: `&#9432;`,
//     },
//     {
//       title: 'Up',
//       url: '',
//       content: `&and;`,
//     },
//     {
//       title: 'Down',
//       url: '',
//       content: `&or;`,
//     }
//   ];
//   const navItemsRender = navItemsData.map((item, i) => {
//     if (item.title === 'Back') {
//       return (
//         <li key={i}>
//           <Link
//             to={item.url}
//             dangerouslySetInnerHTML={{ __html: item.content }}
//             title={item.title}
//           />
//         </li>
//       );
//     } else {
//       return (
//         <li key={i}>
//           <button
//             title={item.title}
//             onClick={props.onclick}
//             data-anchor={item.url}
//             aria-label={`Navigation button: ${item.title}`}
//             dangerouslySetInnerHTML={{ __html: item.content }}
//             className={item.class}
//           />
//         </li>
//       );
//     }
//   });
//   return (
//     <nav className={styles.navigation}>
//       <ul>
//         {navItemsRender}
//       </ul>
//     </nav>
//   );
// }

// function Map(props) {
//   const areasData = props.areas ? props.areas : [];
//   const traps = [];
//   let screenFrame;
//   if (props.map && props.map.image && props.map.width && props.map.height && props.map.padding) {
//     screenFrame = {
//       padding: props.map.padding,
//       gridTemplateColumns: 'repeat(' + props.map.width + ', 1fr)',
//       gridTemplateRows: 'repeat(' + props.map.height + ', 1fr)',
//     };
//   }
//   const areasRender = areasData.map((area, i) => {
//     const style = {
//       gridColumnStart: area.x,
//       gridRowStart: area.y,
//     }
//     area.traps &&
//     area.traps.forEach((trap, i) => {
//       const style = {
//         gridColumnStart: trap.x,
//         gridColumnEnd: trap.x + trap.w,
//         gridRowStart: trap.y,
//         gridRowEnd: trap.y + trap.h,
//       }
//       traps.push({
//         style: style,
//       });
//     });
//     return (
//       <li
//         key={i}
//         style={style}
//         className={styles.mapArea}
//       >
//         <div>
//           <p>{area.name}</p>
//           {area.flags &&
//             <ul className={styles.flags}>
//               {area.flags.map((flag, i) => (
//                 <li key={i}>
//                   <p className={'game-icon game-icon-' + flag}/>
//                 </li>
//               ))}
//             </ul>
//           }
//         </div>
//         <Link
//           to={'./#' + (i+1)}
//         >
//           <span>{i+1}</span>
//         </Link>
//       </li>
//     );
//   });
//   const trapsRender = traps.map((trap, i) => (
//     <li
//       key={i}
//       style={trap.style}
//       className={styles.trap}
//     />
//   ));
//   return (
//     <React.Fragment>
//       <AnchorLink
//         id='map'
//       />
//       <section className={styles.map}>
//         <GatsbyImage
//           image={props.image}
//           loading='eager'
//           alt={'Map of ' + props.title}
//         />
//         <ul
//           className={styles.grid}
//           style={screenFrame}
//         >
//           {areasRender}
//           {trapsRender}
//         </ul>
//       </section>
//     </React.Fragment>
//   )
// }

// function GeneralFeatures(props) {
//   return (
//     <React.Fragment>
//       <AnchorLink id='general'/>
//       <section className={styles.general + ' dmcm--text'}>
//         <h3>General Features</h3>
//         <MDXProvider components={ shortcodes }>
//           <MDXRenderer>
//             {props.body}
//           </MDXRenderer>
//         </MDXProvider>
//       </section>
//     </React.Fragment>
//   );
// }

// function Areas(props) {
//   const areasList = props.areas.map((area, i) => {
//     const pad = (number) => {
//       number = number.toString();
//       number = number < 10 ? '0' + number : number;
//       return number;
//     }
//     const areaItem = (
//       <React.Fragment>
//         <AnchorLink
//           id={i+1}
//         />
//         <section className={`dmcm--text ${styles.area}`}>
//           <h4><span>{pad(i+1)}.</span>{area.name}</h4>
//           {area.flavor &&
//             <div
//               dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.flavor) }}
//               className='flavor'
//             />
//           }
//           {area.callout &&
//             <div
//               dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.callout) }}
//               className='callout'
//             />
//           }
//           <MarkdownView
//             markdown={area.content}
//             components={{Dice, MonsterLink, SpellLink}}
//           />
//         </section>
//       </React.Fragment>
//     );
//     return (
//       <li key={i}>{areaItem}</li>
//     );
//   });

//   return (
//     <ol className={styles.areaList}>
//       {areasList}
//     </ol>
//   );
// }

// function PlayerStats(props) {
//   const playersList = props.players.map((player, i) => {
//     const playersItem = (
//       <React.Fragment>
//         {player.name &&
//           <p>{player.name.split(' ')[0]}</p>
//         }
//         {player.passiveperception &&
//           <p>{player.passiveperception}</p>
//         }
//       </React.Fragment>
//     );
//     return (
//       <li key={i}>
//         {playersItem}
//       </li>
//     );
//   });
//   return (
//     <section className={styles.playerStats}>
//       <h6>Player Stats</h6>
//       <ul>
//         {playersList}
//       </ul>
//     </section>
//   );
// }

// class LocationPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleNavClick = this.handleNavClick.bind(this);
//     this.state = {
//       anchor: this.props.location.hash,
//     };
//   }

//   handleNavClick(event) {
//     let hash = parseInt(this.props.location.hash.substring(1));
//     const max = this.props.data.mdx.
// frontmatter.areas ? this.props.data.mdx.frontmatter.areas.length : 1;
//     if (event.target.title === 'Down') {
//       if (hash >= 1 && hash !== max) {
//         hash = '#' + (hash+1);
//       } else {
//         hash = '#1';
//       }
//     } else if (event.target.title === 'Up') {
//       if (hash <= max && hash > 1) {
//         hash = '#' + (hash-1);
//       } else {
//         hash = '#' + max;
//       }
//     } else {
//       hash = event.target.dataset.anchor;
//     }
//     this.setState({anchor: hash}, () => navigate(this.state.anchor));
//   }

//   render() {
//     return (
//       <Layout
//         title={this.props.data.mdx.frontmatter.title}
//         className={styles.locationWrapper}
//         pageTitle={this.props.data.mdx.frontmatter.title + ': DMCM'}
//       >
//         <Navigation
//           adventure={`/${this.props.data.adventure.slug}`}
//           onclick={this.handleNavClick}
//           location={this.state.anchor}
//           adventureTitle={this.props.data.adventure.frontmatter.title}
//         />
//         {this.props.data.mdx.frontmatter.map && this.props.data.mdx.frontmatter.map.image &&
//           <Map
//             image={getImage(this.props.data.mdx.frontmatter.map.image)}
//             map={this.props.data.mdx.frontmatter.map}
//             title={this.props.data.mdx.frontmatter.title}
//             areas={this.props.data.mdx.frontmatter.areas}
//           />
//         }
//         {this.props.data.mdx.body &&
//           <GeneralFeatures
//             body={this.props.data.mdx.body}
//           />
//         }
//         {this.props.data.mdx.frontmatter.areas &&
//           <Areas
//             areas={this.props.data.mdx.frontmatter.areas}
//           />
//         }
//         {this.props.data.adventure.frontmatter.players &&
//           <PlayerStats
//             players={this.props.data.adventure.frontmatter.players}
//           />
//         }
//       </Layout>
//     );
//   }
// }

// export default LocationPage;
*/ }
