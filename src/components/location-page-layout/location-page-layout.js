import React from 'react';
import { graphql, Link } from 'gatsby';
import { navigate } from '@reach/router';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../layout/layout';

export const query = graphql`
query ($id: String, $pid: String) {
  mdx(id: {eq: $id}) {
    id
    fields {
      slug
    }
    frontmatter {
      title
      areas {
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
  }
}
`

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
    area.traps.map((trap, i) => {
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
    console.log(area.traps);
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
    <section>
      <AnchorLink
        id='map'
      />
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
  )
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
        {/*<GeneralFeatures></GeneralFeatures>
        <Areas></Areas>
        <PlayerStats></PlayerStats>*/}
      </Layout>
    );
  }
}

export default LocationPage;

/*function NavButtonsList(props) {
  const navButtonsData = [
    {
      title: 'Map',
      classes: ['iconfont', 'icon-map'].join(' ')
    },
    {
      title: 'Features',
      content: '&#9432;'
    },
    {
      title: 'Up',
      content: '&and;'
    },
    {
      title: 'Down',
      content: '&or;'
    }
  ];
  const navButtonsMarkup = navButtonsData.map((b, i) => (
    <NavigationButton
      key={i}
      data={b}
    />
  ));
  return (
    <nav>
      <Link
        to={props.location}
      >
        &lt;
      </Link>
      {navButtonsMarkup}
    </nav>
  );
}

function GroupStats(props) {
  return (
    <section>

    </section>
  );
}

class DiceRoller extends React.Component {
  render() {
    const amount = this.props.amount ? this.props.amount : '1',
    type = this.props.type,
    modifier = this.props.modifier ? (
      this.props.modifier > 0 ? ('+' + this.props.modifier) : ('-' + this.props.modifier)
    ) : '';
    return (
      <section>
        <ul>
          <li>
            <p>{amount}d{type}{modifier}</p>
          </li>
          <li>
            <p></p>
          </li>
        </ul>
      </section>
    );
  }
}

class NavigationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {anchor: ''}
    this.hasNav = this.hashNav.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  hashNav() {
    console.log(this.state.anchor);
  }

  handleClick(event) {
    console.log(event.target);
    this.setState({anchor: this.props.data.title}, this.hashNav);
  }

  render() {
    return (
      <button
        onClick={this.handleClick} 
        aria-label={'Navigation button: ' + this.props.data.title}
        dangerouslySetInnerHTML={{ __html: this.props.data.content ? this.props.data.content : '&nbsp;' }}
      />
    );
  }
}

class LocationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dieType: 4,
      dieAmount: 3,
      modifier: 5,
      result: 0
    }
  }

  handleRoll(type, amount = 1, modifier = 0) {
    const result = (1 + Math.floor(Math.random() * type)) * amount + modifier;
    this.setState({result: result,})
  }

  render() {*/
    /*
    TODO: pass a prop to Layout containing a method defined in this class component that changes the states of the dice states defined above.

    In the Layout component write code that looks for button formula text using a hook that fires after the page has loaded (componentDidMount()? maybe another). It will change text to buttons and give those buttons an onClick() method that references handleRoll
    */
    /*console.log(this.props.location.pathname.split('locations/')[0]);
    return (
      <Layout>
        <NavButtonsList
          location={this.props.location.pathname.split('/locations/')[0]}
        />
        <DiceRoller
          type={this.state.dieType}
          amount={this.state.dieAmount}
          modifier={this.state.modifier}
        />
        <GroupStats/>
        <h1>hello world</h1>
      </Layout>
    );
  }
}

export default LocationPage;*/