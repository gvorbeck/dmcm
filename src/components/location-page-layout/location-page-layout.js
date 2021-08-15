import React from 'react';
import { graphql, Link } from 'gatsby';
import { navigate } from '@reach/router';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../layout/layout';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import showdown from 'showdown';

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
      }
    }
  }
  adventure: mdx(id: {eq: $pid}) {
    slug
    frontmatter {
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

function Navigation(props) {
  const navItemsData = [
    {
      title: 'Back',
      url: props.adventure,
      content: `&lt;`,
    },
    {
      title: 'Map',
      url: '#map',
      content: ' ',
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
          />
        </li>
      );
    }
  });
  return (
    <nav>
      <ul>
        {navItemsRender}
      </ul>
    </nav>
  );
}

function DiceTable(props) {
  const formula = props.amount + 'd' + props.type + '+' + props.modifier;
  return (
    <section>
      <ul>
        <li>{formula}</li>
        <li>{props.result}</li>
      </ul>
    </section>
  );
}

function AnchorLink(props) {
  return (
    <a
      href='!#'
      id={props.id}
      dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
      aria-label='Anchor link'
    />
  );
}

function Map(props) {
  const areasData = props.areas;
  const traps = [];
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
      >
        <div>
          <p>{area.name}</p>
          {area.flags &&
            <ul>
              {area.flags.map((flag, i) => (
                <li
                  key={i}
                />
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
    />
  ));
  return (
    <React.Fragment>
      <AnchorLink
        id='map'
      />
      <section>
        <GatsbyImage
          image={props.image}
          loading='eager'
          alt={'Map of ' + props.title}
        />
        <ul>
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
      <AnchorLink
        id='general'
      />
      <section>
        <MDXProvider
          components={ Link }
        >
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
    const areaItem = (
      <React.Fragment>
        <AnchorLink
          id={i+1}
        />
        <section>
          {area.flavor &&
            <div
              dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.flavor) }}
            />
          }
          {area.callout &&
            <div
              dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.callout) }}
            />
          }
          <div
            dangerouslySetInnerHTML={{ __html: converter.makeHtml(area.content) }}
          />
        </section>
      </React.Fragment>
    );
    return (
      <li key={i}>{areaItem}</li>
    );
  });

  return (
    <ol>
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
    <section>
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
      dice: {
        amount: 0,
        type: 0,
        modifier: 0,
        result: 0,
      }
    };
  }

  handleNavClick(event) {
    let hash = parseInt(this.props.location.hash.substring(1));
    const max = this.props.data.mdx.frontmatter.areas.length;
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
      <Layout>
        <header></header>
        <Navigation
          adventure={`/${this.props.data.adventure.slug}`}
          onclick={this.handleNavClick}
          location={this.state.anchor}
        />
        <DiceTable
          amount={this.state.dice.amount}
          type={this.state.dice.type}
          modifier={this.state.dice.modifier}
          result={this.state.dice.result}
        />
        {this.props.data.mdx.frontmatter.map.image &&
          <Map
            image={getImage(this.props.data.mdx.frontmatter.map.image)}
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

    /*
    TODO: pass a prop to Layout containing a method defined in this class component that changes the states of the dice states defined above.

    In the Layout component write code that looks for button formula text using a hook that fires after the page has loaded (componentDidMount()? maybe another). It will change text to buttons and give those buttons an onClick() method that references handleRoll
    */