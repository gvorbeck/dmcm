import React from 'react';
import { graphql, Link } from 'gatsby';
import { navigate } from '@reach/router';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import AnchorLink from '../anchorlink/anchorlink';
import Dice from '../dice/dice';
import Layout from '../layout/layout';
import { SpellLink, MonsterLink } from '../int-link/int-link';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import showdown from 'showdown';
import MarkdownView from 'react-showdown';
import * as styles from './location-page-layout.module.scss';

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
`
const converter = new showdown.Converter();
const shortcodes = { Dice };

function Navigation(props) {
  const navItemsData = [
    {
      title: 'Back to ' + props.adventureTitle,
      url: props.adventure,
      content: `&lt;`,
    },
    {
      title: 'Map',
      url: '#map',
      content: ' ',
      class: 'game-icon game-icon-treasure-map'
    },
    {
      title: 'General Features',
      url: '#general',
      content: `&#9432;`,
    },
    {
      title: 'Up',
      url: '',
      content: `&and;`,
    },
    {
      title: 'Down',
      url: '',
      content: `&or;`,
    }
  ];
  const navItemsRender = navItemsData.map((item, i) => {
    if (item.title === 'Back') {
      return (
        <li key={i}>
          <Link
            to={item.url}
            dangerouslySetInnerHTML={{ __html: item.content }}
            title={item.title}
          />
        </li>
      );
    } else {
      return (
        <li key={i}>
          <button
            title={item.title}
            onClick={props.onclick}
            data-anchor={item.url}
            aria-label={`Navigation button: ${item.title}`}
            dangerouslySetInnerHTML={{ __html: item.content }}
            className={item.class}
          />
        </li>
      );
    }
  });
  return (
    <nav className={styles.navigation}>
      <ul>
        {navItemsRender}
      </ul>
    </nav>
  );
}

function Map(props) {
  const areasData = props.areas ? props.areas : [];
  const traps = [];
  let screenFrame;
  if (props.map && props.map.image && props.map.width && props.map.height && props.map.padding) {
    screenFrame = {
      padding: props.map.padding,
      gridTemplateColumns: 'repeat(' + props.map.width + ', 1fr)',
      gridTemplateRows: 'repeat(' + props.map.height + ', 1fr)',
    };
  }
  const areasRender = areasData.map((area, i) => {
    const style = {
      gridColumnStart: area.x,
      gridRowStart: area.y,
    }
    area.traps &&
    area.traps.forEach((trap, i) => {
      const style = {
        gridColumnStart: trap.x,
        gridColumnEnd: trap.x + trap.w,
        gridRowStart: trap.y,
        gridRowEnd: trap.y + trap.h,
      }
      traps.push({
        style: style,
      });
    });
    return (
      <li
        key={i}
        style={style}
        className={styles.mapArea}
      >
        <div>
          <p>{area.name}</p>
          {area.flags &&
            <ul className={styles.flags}>
              {area.flags.map((flag, i) => (
                <li key={i}>
                  <p className={'game-icon game-icon-' + flag}/>
                </li>
              ))}
            </ul>
          }
        </div>
        <Link
          to={'./#' + (i+1)}
        >
          <span>{i+1}</span>
        </Link>
      </li>
    );
  });
  const trapsRender = traps.map((trap, i) => (
    <li
      key={i}
      style={trap.style}
      className={styles.trap}
    />
  ));
  return (
    <React.Fragment>
      <AnchorLink
        id='map'
      />
      <section className={styles.map}>
        <GatsbyImage
          image={props.image}
          loading='eager'
          alt={'Map of ' + props.title}
        />
        <ul
          className={styles.grid}
          style={screenFrame}
        >
          {areasRender}
          {trapsRender}
        </ul>
      </section>
    </React.Fragment>
  )
}

function GeneralFeatures(props) {
  return (
    <React.Fragment>
      <AnchorLink id='general'/>
      <section className={styles.general + ' dmcm--text'}>
        <h3>General Features</h3>
        <MDXProvider components={ shortcodes }>
          <MDXRenderer>
            {props.body}
          </MDXRenderer>
        </MDXProvider>
      </section>
    </React.Fragment>
  );
}

function Areas(props) {
  const areasList = props.areas.map((area, i) => {
    const pad = (number) => {
      number = number.toString();
      number = number < 10 ? '0' + number : number;
      return number;
    }
    const areaItem = (
      <React.Fragment>
        <AnchorLink
          id={i+1}
        />
        <section className={`dmcm--text ${styles.area}`}>
          <h4><span>{pad(i+1)}.</span>{area.name}</h4>
          {area.flavor &&
            <div
              dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.flavor) }}
              className='flavor'
            />
          }
          {area.callout &&
            <div
              dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.callout) }}
              className='callout'
            />
          }
          <MarkdownView
            markdown={area.content}
            components={{Dice, MonsterLink, SpellLink}}
          />
        </section>
      </React.Fragment>
    );
    return (
      <li key={i}>{areaItem}</li>
    );
  });

  return (
    <ol className={styles.areaList}>
      {areasList}
    </ol>
  );
}

function PlayerStats(props) {
  const playersList = props.players.map((player, i) => {
    const playersItem = (
      <React.Fragment>
        {player.name &&
          <p>{player.name.split(' ')[0]}</p>
        }
        {player.passiveperception &&
          <p>{player.passiveperception}</p>
        }
      </React.Fragment>
    );
    return (
      <li key={i}>
        {playersItem}
      </li>
    );
  });
  return (
    <section className={styles.playerStats}>
      <h6>Player Stats</h6>
      <ul>
        {playersList}
      </ul>
    </section>
  );
}

class LocationPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.state = {
      anchor: this.props.location.hash,
    };
  }

  handleNavClick(event) {
    let hash = parseInt(this.props.location.hash.substring(1));
    const max = this.props.data.mdx.frontmatter.areas ? this.props.data.mdx.frontmatter.areas.length : 1;
    if (event.target.title === 'Down') {
      if (hash >= 1 && hash !== max) {
        hash = '#' + (hash+1);
      } else {
        hash = '#1';
      }
    } else if (event.target.title === 'Up') {
      if (hash <= max && hash > 1) {
        hash = '#' + (hash-1);
      } else {
        hash = '#' + max;
      }
    } else {
      hash = event.target.dataset.anchor;
    }
    this.setState({anchor: hash}, () => navigate(this.state.anchor));
  }

  render() {
    return (
      <Layout
        title={this.props.data.mdx.frontmatter.title}
        className={styles.locationWrapper}
        pageTitle={this.props.data.mdx.frontmatter.title + ': DMCM'}
      >
        <Navigation
          adventure={`/${this.props.data.adventure.slug}`}
          onclick={this.handleNavClick}
          location={this.state.anchor}
          adventureTitle={this.props.data.adventure.frontmatter.title}
        />
        {this.props.data.mdx.frontmatter.map && this.props.data.mdx.frontmatter.map.image &&
          <Map
            image={getImage(this.props.data.mdx.frontmatter.map.image)}
            map={this.props.data.mdx.frontmatter.map}
            title={this.props.data.mdx.frontmatter.title}
            areas={this.props.data.mdx.frontmatter.areas}
          />
        }
        {this.props.data.mdx.body &&
          <GeneralFeatures
            body={this.props.data.mdx.body}
          />
        }
        {this.props.data.mdx.frontmatter.areas &&
          <Areas
            areas={this.props.data.mdx.frontmatter.areas}
          />
        }
        {this.props.data.adventure.frontmatter.players &&
          <PlayerStats
            players={this.props.data.adventure.frontmatter.players}
          />
        }
      </Layout>
    );
  }
}

export default LocationPage;
