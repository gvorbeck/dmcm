import React from 'react';
import { graphql } from 'gatsby';
import Attack from '../components/attack/attack';
import Dice from '../components/dice/dice';
import Layout from '../components/layout/layout';
import { SpellLink } from '../components/int-link/int-link';
import showdown from 'showdown';
import MarkdownView from 'react-showdown';
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

function monsterAdvBlocks(area) {
  const formattedItems = [];
  for (let i=0,l=area.length;i<l;i++) {
    formattedItems.push(
      <li key={i}>
        <h4>{area[i].name}</h4>
        <MarkdownView
          markdown={area[i].content}
          components={{Dice, Attack, SpellLink}}
        />
      </li>
    );
  }
  return formattedItems;
}

function monsterSimpleBlocks(area, type) {
  const formattedItems = [];
  for (let i=0,l=area.length;i<l;i++) {
    formattedItems.push(
      <li key={i}>
        <button
          className='dmcm--simple-button'
          data-title={`${type}: ${area[i].name}`}
          data-modifier={area[i].modifier}
        >
          {area[i].name}: +{area[i].modifier}
        </button>
      </li>
    );
  }
  return formattedItems;
}

function resultMarkup(monster, index) {
  let speedList = [],
      abilityList = [];

  if (monster.speed) {
    for (let i=0,l=monster.speed.length;i<l;i++) {
      speedList.push(
        <li key={i}>{monster.speed[i]}</li>
      );
    }
  }

  if (monster.abilities) {
    for (const [key, value] of Object.entries(monster.abilities)) {
      const modifier = Math.floor((value - 10) / 2);
      abilityList.push(
        <li 
          key={key}
          className={styles.ability}
        >
          <button
            className='dmcm--ability-button'
            data-modifier={modifier}
            data-title={`Ability Check: ${key.toUpperCase()}`}
          >
            <span>{key.toUpperCase()}</span>
            <span className={styles.modifier}>{modifier}</span>
            <span className={styles.value}>{value}</span>
          </button>
        </li>
      );
    }
  }
  return (
    <article
      key={index}
      className={styles.monster}
    >
      <h1>{monster.name}</h1>
      <h2>{monster.type}</h2>
      <ul className={styles.abilities}>{abilityList}</ul>
      <div className={styles.short}>
        <dl className={styles.stats}>
          {monster.ac &&
            <React.Fragment>
              <dt>Armor Class</dt>
              <dd>{monster.ac.value}{monster.ac.notes}</dd>
            </React.Fragment>
          }
          {monster.hp &&
            <React.Fragment>
              <dt>Hit Points</dt>
              <dd>{monster.hp.value} 
                <MarkdownView
                  markdown={monster.hp.notes}
                  components={{ Dice }}
                />
              </dd>
            </React.Fragment>
          }
          {speedList.length > 0 &&
            <React.Fragment>
              <dt>Speed</dt>
              <dd>
                <ul>{speedList}</ul>
              </dd>
            </React.Fragment>
          }
        </dl>
        <dl className={styles.stats}>
          {monster.saves &&
            <React.Fragment>
              <dt>Saving Throws</dt>
              <dd>
                <ul>{monsterSimpleBlocks(monster.saves, 'Saving Throw')}</ul>
              </dd>
            </React.Fragment>
          }
          {monster.skills &&
            <React.Fragment>
              <dt>Skills</dt>
              <dd>
                <ul>{monsterSimpleBlocks(monster.skills, 'Skill Check')}</ul>
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
          {monster.senses &&
            <React.Fragment>
              <dt>Senses</dt>
              <dd>{monster.senses.join(', ')}</dd>
            </React.Fragment>
          }
          {monster.languages &&
            <React.Fragment>
              <dt>Languages</dt>
              <dd>{monster.languages.join(', ')}</dd>
            </React.Fragment>
          }
          {monster.challenge &&
            <React.Fragment>
              <dt>Challenge</dt>
              <dd>{monster.challenge}</dd>
            </React.Fragment>
          }
        </dl>
      </div>
      <div className={`${styles.long} dmcm--text`}>
        {monster.traits &&
          <div>
            <h3>Traits</h3>
            <ul>{monsterAdvBlocks(monster.traits)}</ul>
          </div>
        }
        {monster.actions &&
          <div>
            <h3>Actions</h3>
            <ul>{monsterAdvBlocks(monster.actions)}</ul>
          </div>
        }
        {monster.reactions &&
          <div>
            <h3>Reactions</h3>
            <ul>{monsterAdvBlocks(monster.reactions)}</ul>
          </div>
        }
        {monster.lgdyactions &&
          <div>
            <h3>Legendary Actions</h3>
            <ul>{monsterAdvBlocks(monster.lgdyactions)}</ul>
          </div>
        }
        {monster.description &&
          <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(monster.description)}} />
        }
        <p className={styles.source}>{monster.source}</p>
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
            placeholder={this.props.placeholder}
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
        <form onSubmit={this.handleSubmit}>
          <SearchTextInput
            onTextChange={this.handleTextChange}
            text={text}
            placeholder='Example'
          />
          <input
            type='submit'
            value='Submit'
          />
        </form>
        <div>
          {searchResults}
        </div>
      </Layout>
    );
  }
};

export default BeastPage;
