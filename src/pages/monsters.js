import React from 'react';
import { graphql } from 'gatsby';
import showdown from 'showdown';
import Dice from '../components/dice/dice';
import Layout from '../components/layout/layout';
import * as styles from '../styles/monsters.module.scss';

export const query = graphql`
  query MonsterPageQuery {
    allMdx(filter: {fields: {slug: {regex: "/monsters/"}}}) {
      edges {
        node {
          id
          frontmatter {
            monsters {
              name
              type
              ac {
                value
                notes
              }
              hp {
                value
                notes
              }
              speed
              abilities {
                str
                dex
                con
                int
                wis
                cha
              }
              saves {
                name
                modifier
              }
              skills {
                name
                modifier
              }
              senses
              languages
              challenge
              dmgvulnerabilities
              dmgresistances
              dmgimmunities
              cdnimmunities
              traits {
                name
                content
              }
              actions {
                name
                content
              }
              reactions {
                name
                content
              }
              lgdyactions {
                name
                content
              }
              description
              source
            }
          }
        }
      }
    }
  }
`
const converter = new showdown.Converter();

function monsterAdvBlocks(monster, area) {
  const formattedItems = [];
  for (let i=0,l=area.length;i<l;i++) {
    let content = area[i].content.split(/(\d*d\d+\+?-?\d*)/);
    for (let x=1,y=content.length;x<y;x+=2) {
      content[x] = <Dice key={x}>{content[x]}</Dice>;
    }
    formattedItems.push(
      <li key={i}>
        <h4>{area[i].name}</h4>
        <div>{content}</div>
      </li>
    );
  }
  return formattedItems;
}

function monsterSimpleBlocks(monster, area) {
  const formattedItems = [];
  for (let i=0,l=area.length;i<l;i++) {
    formattedItems.push(
      <li key={i}>{area[i].name}: +{area[i].modifier}</li>
    );
  }
  return formattedItems;
}

function resultMarkup(monster, index) {
  let speedList = [],
      abilityList = [];
  
  for (let i=0,l=monster.speed.length;i<l;i++) {
    speedList.push(
      <li key={i}>{monster.speed[i]}</li>
    );
  }

  for (const [key, value] of Object.entries(monster.abilities)) {
    abilityList.push(
      <li 
        key={key}
        className={styles.ability}
      >
        <p>{key.toUpperCase()}</p>
        <p className={styles.modifier}>{Math.floor(value - 10 / 2)}</p>
        <p className={styles.value}>{value}</p>
      </li>
    );
  }
  return (
    <article key={index}>
      <h1>{monster.name}</h1>
      <ul className={styles.abilities}>{abilityList}</ul>
      <div className={styles.short}>
        <h2>{monster.type}</h2>
        <dl>
          <dt>Armor Class</dt>
          <dd>{monster.ac.value}{monster.ac.notes}</dd>
          <dt>Hit Points</dt>
          <dd>{monster.hp.value}{monster.hp.notes}</dd>
          <dt>Speed</dt>
          <dd>
            <ul>{speedList}</ul>
          </dd>
        </dl>
        <dl>
          {monster.saves &&
            <React.Fragment>
              <dt>Saving Throws</dt>
              <dd>
                <ul>{monsterSimpleBlocks(monster, monster.saves)}</ul>
              </dd>
            </React.Fragment>
          }
          {monster.skills &&
            <React.Fragment>
              <dt>Skills</dt>
              <dd>
                <ul>{monsterSimpleBlocks(monster, monster.skills)}</ul>
              </dd>
            </React.Fragment>
          }
          {monster.dmgvulnerabilities &&
            <React.Fragment>
              <dt>Damage Vulnerabilities</dt>
              <dd>{monster.dmgvulnerabilities.join(', ')}</dd>
            </React.Fragment>
          }
          {monster.dmgresistances &&
            <React.Fragment>
              <dt>Damage Resistances</dt>
              <dd>{monster.dmgresistances.join(', ')}</dd>
            </React.Fragment>
          }
          {monster.dmgimmunities &&
            <React.Fragment>
              <dt>Damage Immunities</dt>
              <dd>{monster.dmgimmunities.join(', ')}</dd>
            </React.Fragment>
          }
          {monster.cdnimmunities &&
            <React.Fragment>
              <dt>Condition Immunities</dt>
              <dd>{monster.cdnimmunities.join(', ')}</dd>
            </React.Fragment>
          }
          <dt>Senses</dt>
          <dd>{monster.senses.join(', ')}</dd>
          <dt>Languages</dt>
          <dd>{monster.languages.join(', ')}</dd>
          <dt>Challenge</dt>
          <dd>{monster.challenge}</dd>
        </dl>
      </div>
      <div className={styles.long}>
        {monster.traits &&
          <div>
            <h3>Traits</h3>
            <ul>{monsterAdvBlocks(monster, monster.traits)}</ul>
          </div>
        }
        {monster.actions &&
          <div>
            <h3>Actions</h3>
            <ul>{monsterAdvBlocks(monster, monster.actions)}</ul>
          </div>
        }
        {monster.reactions &&
          <div>
            <h3>Reactions</h3>
            <ul>{monsterAdvBlocks(monster, monster.reactions)}</ul>
          </div>
        }
        {monster.lgdyactions &&
          <div>
            <h3>Legendary Actions</h3>
            <ul>{monsterAdvBlocks(monster, monster.lgdyactions)}</ul>
          </div>
        }
        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(monster.description)}} />
        <p>{monster.source}</p>
      </div>
    </article>
  );
}

function resultList(monsters) {
  let monsterList = [];
  for (let i=0,l=monsters.length;i<l;i++) {
    monsterList.push(resultMarkup(monsters[i], i));
  }
  return monsterList;
}

class SearchTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTextChange(e.target.value);
  }

  render() {
    const text = this.props.text;
    return (
      <fieldset>
        <label>
          Name: 
          <input
            type='text'
            value={text}
            onChange={this.handleChange}
          />
        </label>
      </fieldset>
    );
  }
}

class BeastPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getResults = this.getResults.bind(this);
    this.state = {inputText: '', searchResults: []};
  }

  componentDidMount() {
    this.monsterList = [];
    for (let i=0,l=this.props.data.allMdx.edges.length;i<l;i++) {
      let monsters = this.props.data.allMdx.edges[i].node.frontmatter.monsters;
      for (let x=0,y=monsters.length;x<y;x++) {
        this.monsterList.push(monsters[x]);
      }
    }
    
    if (this.props.location.search) {
      const params = new URLSearchParams(this.props.location.search);
      this.getResults(params.get('m'));
    }
  }

  getResults(query) {
    let results = [];
    for (let i=0,l=this.monsterList.length;i<l;i++) {
      if (this.monsterList[i].name.toUpperCase().includes(query.toUpperCase())) {
        results.push(this.monsterList[i]);
      }
    }

    this.setState({searchResults: results});
  }

  handleTextChange(text) {
    this.setState({inputText: text});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.inputText) {
      this.getResults(this.state.inputText);
    }
  }

  render() {
    const text = this.state.inputText;
    const results = this.state.searchResults;
    let searchResults;
    if (results.length) {
      searchResults = resultList(results);
    } else {
      searchResults = ''
    }
    return (
      <Layout
        title={'Bestiary'}
        className={styles.bestiaryWrapper}
      >
        <form
          onSubmit={this.handleSubmit}
        >
          <SearchTextInput
            onTextChange={this.handleTextChange}
            text={text}
          />
          <input
            type='submit'
            value='Submit'
          />
        </form>
        <div className={styles.results}>
          {searchResults}
        </div>
      </Layout>
    );
  }
};

export default BeastPage;
