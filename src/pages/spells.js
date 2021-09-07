import React from 'react';
import { graphql } from 'gatsby';
import Dice from '../components/dice/dice';
import Layout from '../components/layout/layout';
import MarkdownView from 'react-showdown';
import * as styles from '../styles/spells.module.scss';

export const query = graphql`
  query SpellPageQuery {
    allMdx(filter: {fields: {slug: {regex: "/spells/"}}}) {
      edges {
        node {
          id
          frontmatter {
            spells {
              name
              source
              castingtime
              classes
              components
              description
              duration
              level
              range
              ritual
              school
              attacksave
              damage
            }
          }
        }
      }
    }
  }
`

function resultMarkup(spell, index) {
  return(
    <article
      key={index}
      className={styles.spell}
    >
      <h1>{spell.name}</h1>
      <h2>{spell.level} {spell.school}{spell.ritual? ' (ritual)':''}</h2>
      <h3>{spell.classes.join(', ')}</h3>
      <dl className={styles.stats}>
        {spell.castingtime &&
          <React.Fragment>
            <dt>Casting Time</dt>
            <dd>{spell.castingtime}</dd>
          </React.Fragment>
        }
        {spell.range &&
          <React.Fragment>
            <dt>Range</dt>
            <dd>{spell.range}</dd>
          </React.Fragment>
        }
        {spell.components &&
          <React.Fragment>
            <dt>Components</dt>
            <dd>{spell.components}</dd>
          </React.Fragment>
        }
        {spell.duration &&
          <React.Fragment>
            <dt>Duration</dt>
            <dd>{spell.duration}</dd>
          </React.Fragment>
        }
        {spell.attacksave &&
          <React.Fragment>
            <dt>Attack/Save</dt>
            <dd>{spell.attacksave}</dd>
          </React.Fragment>
        }
        {spell.damage &&
          <React.Fragment>
            <dt>Damage</dt>
            <dd>{spell.damage}</dd>
          </React.Fragment>
        }
      </dl>
      <MarkdownView
        className={styles.content}
        markdown={spell.description}
        components={{Dice}}
      />
      <p className={styles.source}>{spell.source}</p>
    </article>
  );
}

function resultList(spells) {
  let spellList = [];
  for (let i=0,l=spells.length;i<l;i++) {
    spellList.push(resultMarkup(spells[i], i));
  }
  return spellList;
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
            value={text}
            type='text'
            onChange={this.handleChange}
          />
        </label>
      </fieldset>
    );
  }
}

class SpellPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getResults = this.getResults.bind(this);
    this.state = {inputText: '', searchResults: []};
  }

  componentDidMount() {
    this.spellList = [];
    for (let i=0,l=this.props.data.allMdx.edges.length;i<l;i++) {
      let spells = this.props.data.allMdx.edges[i].node.frontmatter.spells;
      for (let x=0,y=spells.length;x<y;x++) {
        this.spellList.push(spells[x]);
      }
    }

    if (this.props.location.search) {
      const params = new URLSearchParams(this.props.location.search);
      this.getResults(params.get('s'));
    }
  }

  getResults(query) {
    let results = [];
    for (let i=0,l=this.spellList.length;i<l;i++) {
      if (this.spellList[i].name.toUpperCase().includes(query.toUpperCase())) {
        results.push(this.spellList[i]);
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
      searchResults = <p>Please search</p>
    }

    return (
      <Layout
        title='Spellbook'
        className={styles.spellsWrapper}
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
        <div>{searchResults}</div>
      </Layout>
    );
  }
}

export default SpellPage;
