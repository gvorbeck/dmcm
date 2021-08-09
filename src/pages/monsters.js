import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';

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
            }
          }
        }
      }
    }
  }
`

function resultMarkup(monster) {
  return (
    <article>
      <h1>{monster.name}</h1>
      <h2>{monster.type}</h2>
      <dl>
        <dt>Armor Class</dt>
        <dd>{monster.ac.value}{monster.ac.notes}</dd>
        <dt>Hit Points</dt>
        <dd>{monster.hp.value}{monster.hp.notes}</dd>
      </dl>
    </article>
  );
}

function resultList(monsters) {
  let monsterList = [];
  for (let i=0,l=monsters.length;i<l;i++) {
    monsterList.push(resultMarkup(monsters[i]));
  }
  return monsterList;
}

class SearchText extends React.Component {
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
          <input value={text} onChange={this.handleChange} />
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
  }

  handleTextChange(text) {
    this.setState({inputText: text});
  }

  handleSubmit(e) {
    e.preventDefault();

    let results = [];
    for (let i=0,l=this.monsterList.length;i<l;i++) {
      if (this.monsterList[i].name.toUpperCase().includes(this.state.inputText.toUpperCase())) {
        results.push(this.monsterList[i]);
      }
    }

    this.setState({searchResults: results});
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
      <Layout>
        <form
          onSubmit={this.handleSubmit}
        >
          <SearchText
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

export default BeastPage;