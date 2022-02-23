/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import showdown from 'showdown';
// import MarkdownView from 'react-showdown';
// import Dice from '../components/dice/dice';
import Layout from '../components/layout/layout';

// const converter = new showdown.Converter();

export default function SearchPage(props) {
  const [searchValue, setSearchValue] = useState('');
  const [haveResults, setHaveResults] = useState('');
  const [resultMarkup, setResultMarkup] = useState('');
  const { location, data } = props;
  const searchData = {
    monsters: [],
    spells: [],
  };

  // GET URL PARAMETERS
  const params = location.search ? JSON.parse(`{"${decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {};

  // SET PAGE TITLE
  let title = 'search';
  if (params.category) {
    if (params.category === 'monsters') {
      title = 'bestiary';
    } else if (params.category === 'spells') {
      title = 'spellbook';
    }
  }

  // FORMAT SEARCH DATA
  if (params.category) {
    data.allMdx.edges.forEach((source) => {
      const content = source.node.frontmatter;
      if (content.monsters && params.category === 'monsters') {
        content.monsters.forEach((monster) => {
          searchData.monsters.push(monster);
        });
      }

      if (content.spells && params.category === 'spells') {
        content.spells.forEach((spell) => {
          searchData.spells.push(spell);
        });
      }
    });
    if (params.category === 'monsters') {
      searchData.monsters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.category === 'spells') {
      searchData.spells.sort((a, b) => a.name.localeCompare(b.name));
    }
  } else {
    console.error('DMCM ERROR: URL Param: \'category\' is missing. Search will not work.');
  }

  // MONSTER RESULT MARKUP
  const monsterCard = (monster, index) => {
    if (monster) {
      const speedList = [];
      if (monster.speed) {
        monster.speed.forEach((s, i) => {
          speedList.push(
            <ListItem key={`speed-${i}`}><ListItemText>{s}</ListItemText></ListItem>,
          );
        });
      }

      const abilityList = [];
      if (monster.abilities) {
        Object.entries(monster.abilities).forEach(([key, value], i) => {
          // console.log(`${index}: ${key} = ${value}`);
          const modifier = Math.floor((value - 10) / 2);
          abilityList.push(
            <ListItem key={`ability-${i}`}>
              <List>
                <ListItem key={`sub-${i}-0`}><ListItemText>{`${key.toUpperCase()}`}</ListItemText></ListItem>
                <ListItem key={`sub-${i}-1`}><ListItemText>{`${modifier}`}</ListItemText></ListItem>
                <ListItem key={`sub-${i}-2`}><ListItemText>{value}</ListItemText></ListItem>
              </List>
            </ListItem>,
          );
        });
      }

      const saveList = [];
      if (monster.saves) {
        monster.saves.forEach((save) => {
          saveList.push(
            <ListItem><ListItemText>{`${save.name} | ${save.modifier}`}</ListItemText></ListItem>,
          );
        });
      }

      const skillList = [];
      if (monster.skills) {
        monster.skills.forEach((skill) => {
          skillList.push(
            <ListItem><ListItemText>{`${skill.name} | ${skill.modifier}`}</ListItemText></ListItem>,
          );
        });
      }

      const simpleStat = (stat) => {
        const list = [];
        if (typeof stat === 'object') {
          stat.forEach((s) => {
            list.push(
              <ListItem><ListItemText>{s}</ListItemText></ListItem>,
            );
          });
          return list;
        } else if (typeof stat === 'string') {
          return (<ListItem><ListItemText>{stat}</ListItemText></ListItem>);
        }
        return null;
      };

      const textStat = (stat) => {
        const list = [];
        stat.forEach((s) => {
          list.push(
            <Typography variant="body1" component="dl">
              <dt>{s.name}</dt>
              <dd>{s.content}</dd>
            </Typography>,
          );
        });
        return list;
      };

      return (
        <ListItem key={`monster-${index}`}>
          <Paper component="article">
            {monster.name && <Typography variant="h1">{monster.name}</Typography>}
            {monster.type && <Typography variant="h2">{monster.type}</Typography>}
            {abilityList && <List>{abilityList}</List>}
            <Container component="dl">
              {monster.ac && (
                <>
                  <Typography variant="body1" component="dt">armor class</Typography>
                  <Typography variant="body1" component="dd">{`${monster.ac.value}${monster.ac.notes ? ` ${monster.ac.notes}` : ''}`}</Typography>
                </>
              )}
              {monster.hp && (
                <>
                  <Typography variant="body1" component="dt">hit points</Typography>
                  <Typography variant="body1" component="dd">{`${monster.hp.value} ${monster.hp.notes}`}</Typography>
                </>
              )}
              {monster.speed && (
                <>
                  <Typography variant="body1" component="dt">speed</Typography>
                  <Typography variant="body1" component="dd"><List>{speedList}</List></Typography>
                </>
              )}
              {monster.saves && (
                <>
                  <Typography variant="body1" component="dt">saving throws</Typography>
                  <Typography variant="body1" component="dd"><List>{saveList}</List></Typography>
                </>
              )}
              {monster.skills && (
                <>
                  <Typography variant="body1" component="dt">skills</Typography>
                  <Typography variant="body1" component="dd"><List>{skillList}</List></Typography>
                </>
              )}
              {monster.dmgvulnerabilities && (
                <>
                  <Typography variant="body1" component="dt">damage vulnerabilities</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.dmgvulnerabilities)}</List></Typography>
                </>
              )}
              {monster.dmgresistances && (
                <>
                  <Typography variant="body1" component="dt">damage resistances</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.dmgresistances)}</List></Typography>
                </>
              )}
              {monster.dmgimmunities && (
                <>
                  <Typography variant="body1" component="dt">damage immunities</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.dmgimmunities)}</List></Typography>
                </>
              )}
              {monster.cdnimmunities && (
                <>
                  <Typography variant="body1" component="dt">condition immunities</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.cdnimmunities)}</List></Typography>
                </>
              )}
              {monster.senses && (
                <>
                  <Typography variant="body1" component="dt">senses</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.senses)}</List></Typography>
                </>
              )}
              {monster.languages && (
                <>
                  <Typography variant="body1" component="dt">languages</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.languages)}</List></Typography>
                </>
              )}
              {monster.challenge && (
                <>
                  <Typography variant="body1" component="dt">challenge rating</Typography>
                  <Typography variant="body1" component="dd"><List>{simpleStat(monster.challenge)}</List></Typography>
                </>
              )}
            </Container>
            <Container component="ul">
              {monster.traits && (
                <>
                  <ListSubheader>traits</ListSubheader>
                  <ListItem>{textStat(monster.traits)}</ListItem>
                </>
              )}
              {monster.actions && (
                <>
                  <ListSubheader>actions</ListSubheader>
                  <ListItem>{textStat(monster.actions)}</ListItem>
                </>
              )}
              {monster.reactions && (
                <>
                  <ListSubheader>reactions</ListSubheader>
                  <ListItem>{textStat(monster.reactions)}</ListItem>
                </>
              )}
              {monster.lgdyactions && (
                <>
                  <ListSubheader>legendary actions</ListSubheader>
                  <ListItem>{textStat(monster.lgdyactions)}</ListItem>
                </>
              )}
            </Container>
          </Paper>
        </ListItem>
      );
    }
    return null;
  };

  // SPELL RESULT MARKUP
  const spellCard = (spell, index) => {
    if (spell) {
      return (
        <ListItem key={`spell-${index}`}>
          <Paper component="article">
            {spell.name && <Typography variant="h1">{spell.name}</Typography>}
            <Typography variant="h2">
              {spell.level && `${spell.level} `}
              {spell.school && `${spell.school} `}
              {spell.ritual && `(${spell.ritual})`}
            </Typography>
            <Container component="dl">
              {spell.castingtime && (
                <>
                  <Typography variant="body1" component="dt">casting time</Typography>
                  <Typography variant="body1" component="dd">{spell.castingtime}</Typography>
                </>
              )}
              {spell.range && (
                <>
                  <Typography variant="body1" component="dt">range</Typography>
                  <Typography variant="body1" component="dd">{spell.range}</Typography>
                </>
              )}
              {spell.components && (
                <>
                  <Typography variant="body1" component="dt">components</Typography>
                  <Typography variant="body1" component="dd">{spell.components}</Typography>
                </>
              )}
              {spell.duration && (
                <>
                  <Typography variant="body1" component="dt">duration</Typography>
                  <Typography variant="body1" component="dd">{spell.duration}</Typography>
                </>
              )}
              {spell.attacksave && (
                <>
                  <Typography variant="body1" component="dt">Attack/Save</Typography>
                  <Typography variant="body1" component="dd">{spell.attacksave}</Typography>
                </>
              )}
              {spell.damage && (
                <>
                  <Typography variant="body1" component="dt">damage</Typography>
                  <Typography variant="body1" component="dd">{spell.damage}</Typography>
                </>
              )}
            </Container>
            <Typography variant="body1" component="section">
              {spell.description}
            </Typography>
            <Typography variant="body1" component="footer">{spell.source}</Typography>
          </Paper>
        </ListItem>
      );
    }
    return null;
  };

  // Result List Builder
  // (Use results of handleSearch to build an array of result markup components)
  const resultListBuilder = (list) => {
    const resultListMarkup = [];
    if (params.category === 'monsters') {
      list.forEach((item, index) => {
        resultListMarkup.push(monsterCard(item, index));
      });
    } else if (params.category === 'spells') {
      list.forEach((item) => {
        resultListMarkup.push(spellCard(item));
      });
    }
    return resultListMarkup;
  };

  // Handle Search
  // (Once search form is submitted OR there is a URL search)
  const handleSearch = (searchStr, list, limit = false) => {
    if (searchStr && list) {
      let matches;
      if (limit) {
        matches = [list[params.category].find(
          (item) => item.name.toUpperCase() === searchStr.toUpperCase(),
        )];
      } else {
        matches = list[params.category].filter(
          (item) => item.name.toUpperCase().indexOf(searchStr.toUpperCase()) !== -1,
        );
      }
      console.log(matches);
      return matches;
    }
    return null;
  };

  // Runs once on page load to find single item results from URL.
  useEffect(() => {
    if (params.name) {
      const result = handleSearch(params.name, searchData, true);
      if (result && result.length) {
        setHaveResults(true);
        setResultMarkup(resultListBuilder(result));
      } else {
        setHaveResults(false);
      }
    }
  }, []);

  // Handle Input Change
  // (Typing in search field)
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle Submit
  // (Submitting search form)
  const handleSubmit = (e) => {
    e.preventDefault();
    const results = handleSearch(searchValue, searchData);

    if (results && results.length) {
      setHaveResults(true);
      setResultMarkup(resultListBuilder(results));
    } else {
      setHaveResults(false);
    }
  };

  return (
    <Layout title={title}>
      <form onSubmit={handleSubmit}>
        <TextField
          id="search-input"
          name="search"
          label="Search"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>
      {haveResults && <Container component="section"><List>{resultMarkup}</List></Container>}
    </Layout>
  );
}

export const query = graphql`
  query SearchQuery {
    allMdx(filter: {fields: {slug: {regex: "/monsters/|/spells/"}}}) {
      edges {
        node {
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
`;
// =================================================================================================
// =================================================================================================

// export default MonstersPage;

// import React from 'react';
// import { graphql } from 'gatsby';
// import Attack from '../components/attack/attack';
// import Dice from '../components/dice/dice';
// import Layout from '../components/layout/layout';
// import SearchForm from '../components/search-form/search-form';
// import Simple from '../components/simple/simple';
// import { SpellLink, MonsterLink } from '../components/int-link/int-link';
// import showdown from 'showdown';
// import MarkdownView from 'react-showdown';
// import * as styles from '../styles/monsters.module.scss';

// export const query = graphql`
//   query MonsterPageQuery {
//     allMdx(filter: {fields: {slug: {regex: "/monsters/"}}}) {
//       edges {
//         node {
//           id
//           frontmatter {
//             monsters {
//               name
//               type
//               ac {
//                 value
//                 notes
//               }
//               hp {
//                 value
//                 notes
//               }
//               speed
//               abilities {
//                 str
//                 dex
//                 con
//                 int
//                 wis
//                 cha
//               }
//               saves {
//                 name
//                 modifier
//               }
//               skills {
//                 name
//                 modifier
//               }
//               senses
//               languages
//               challenge
//               dmgvulnerabilities
//               dmgresistances
//               dmgimmunities
//               cdnimmunities
//               traits {
//                 name
//                 content
//               }
//               actions {
//                 name
//                 content
//               }
//               reactions {
//                 name
//                 content
//               }
//               lgdyactions {
//                 name
//                 content
//               }
//               description
//               source
//             }
//           }
//         }
//       }
//     }
//   }
// `
// const converter = new showdown.Converter();

// function monsterAdvBlocks(area) {
//   const formattedItems = [];
//   for (let i=0,l=area.length;i<l;i++) {
//     formattedItems.push(
//       <li key={i}>
//         <h4>{area[i].name}</h4>
//         <MarkdownView
//           markdown={area[i].content}
//           components={{Dice, Attack, SpellLink, MonsterLink}}
//         />
//       </li>
//     );
//   }
//   return formattedItems;
// }

// function monsterSimpleBlocks(area, type) {
//   const formattedItems = [];
//   for (let i=0,l=area.length;i<l;i++) {
//     formattedItems.push(
//       <li key={i}>
//         <Simple
//           modifier={area[i].modifier}
//           title={`${type}: ${area[i].name}`}
//         >
//           {area[i].name}: +{area[i].modifier}
//         </Simple>
//       </li>
//     );
//   }
//   return formattedItems;
// }

// function resultMarkup(monster, index) {
//   let speedList = [],
//       abilityList = [];
//   if (monster) {
//     if (monster.speed) {
//       for (let i=0,l=monster.speed.length;i<l;i++) {
//         speedList.push(
//           <li key={i}>{monster.speed[i]}</li>
//         );
//       }
//     }

//     if (monster.abilities) {
//       for (const [key, value] of Object.entries(monster.abilities)) {
//         const modifier = Math.floor((value - 10) / 2);
//         abilityList.push(
//           <li
//             key={key}
//             className={styles.ability}
//           >
//             <Simple
//               modifier={modifier}
//               title={`Ability Check: ${key.toUpperCase()}`}
//             >
//               <span>{key.toUpperCase()}</span>
//               <span className={styles.modifier}>{modifier}</span>
//               <span className={styles.value}>{value}</span>
//             </Simple>
//           </li>
//         );
//       }
//     }
//     return (
//       <article
//         key={index}
//         className={styles.monster}
//       >
//         <header>
//           <h1>{monster.name}</h1>
//           <h2>{monster.type}</h2>
//         </header>
//         <ul className={styles.abilities}>{abilityList}</ul>
//         <div className={styles.short}>
//           <dl className={styles.stats}>
//             {monster.ac &&
//               <React.Fragment>
//                 <dt>Armor Class</dt>
//                 <dd>{monster.ac.value} {monster.ac.notes}</dd>
//               </React.Fragment>
//             }
//             {monster.hp &&
//               <React.Fragment>
//                 <dt>Hit Points</dt>
//                 <dd>{monster.hp.value}
//                   <MarkdownView
//                     markdown={monster.hp.notes}
//                     components={{ Dice }}
//                   />
//                 </dd>
//               </React.Fragment>
//             }
//             {speedList.length > 0 &&
//               <React.Fragment>
//                 <dt>Speed</dt>
//                 <dd>
//                   <ul>{speedList}</ul>
//                 </dd>
//               </React.Fragment>
//             }
//           </dl>
//           <dl className={styles.stats}>
//             {monster.saves &&
//               <React.Fragment>
//                 <dt>Saving Throws</dt>
//                 <dd>
//                   <ul>{monsterSimpleBlocks(monster.saves, 'Saving Throw')}</ul>
//                 </dd>
//               </React.Fragment>
//             }
//             {monster.skills &&
//               <React.Fragment>
//                 <dt>Skills</dt>
//                 <dd>
//                   <ul>{monsterSimpleBlocks(monster.skills, 'Skill Check')}</ul>
//                 </dd>
//               </React.Fragment>
//             }
//             {monster.dmgvulnerabilities &&
//               <React.Fragment>
//                 <dt>Damage Vulnerabilities</dt>
//                 <dd>{monster.dmgvulnerabilities.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.dmgresistances &&
//               <React.Fragment>
//                 <dt>Damage Resistances</dt>
//                 <dd>{monster.dmgresistances.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.dmgimmunities &&
//               <React.Fragment>
//                 <dt>Damage Immunities</dt>
//                 <dd>{monster.dmgimmunities.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.cdnimmunities &&
//               <React.Fragment>
//                 <dt>Condition Immunities</dt>
//                 <dd>{monster.cdnimmunities.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.senses &&
//               <React.Fragment>
//                 <dt>Senses</dt>
//                 <dd>{monster.senses.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.languages &&
//               <React.Fragment>
//                 <dt>Languages</dt>
//                 <dd>{monster.languages.join(', ')}</dd>
//               </React.Fragment>
//             }
//             {monster.challenge &&
//               <React.Fragment>
//                 <dt>Challenge</dt>
//                 <dd>{monster.challenge}</dd>
//               </React.Fragment>
//             }
//           </dl>
//         </div>
//         <div className={`${styles.long} dmcm--text`}>
//           {monster.traits &&
//             <div>
//               <h3>Traits</h3>
//               <ul>{monsterAdvBlocks(monster.traits)}</ul>
//             </div>
//           }
//           {monster.actions &&
//             <div>
//               <h3>Actions</h3>
//               <ul>{monsterAdvBlocks(monster.actions)}</ul>
//             </div>
//           }
//           {monster.reactions &&
//             <div>
//               <h3>Reactions</h3>
//               <ul>{monsterAdvBlocks(monster.reactions)}</ul>
//             </div>
//           }
//           {monster.lgdyactions &&
//             <div>
//               <h3>Legendary Actions</h3>
//               <ul>{monsterAdvBlocks(monster.lgdyactions)}</ul>
//             </div>
//           }
//           {monster.description &&
//             <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(monster.description)}} />
//           }
//           <p className={styles.source}>{monster.source}</p>
//         </div>
//       </article>
//     );
//   } else {
//     return (
//       <p>Error: No monster by that name</p>
//     );
//   }
// }

// function resultList(monsters) {
//   let monsterList = [];
//   for (let i=0,l=monsters.length;i<l;i++) {
//     monsterList.push(resultMarkup(monsters[i], i));
//   }
//   return monsterList;
// }

// class BeastPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleTextChange = this.handleTextChange.bind(this);
//     this.handleSearch = this.handleSearch.bind(this);
//     this.getResults = this.getResults.bind(this);
//     this.state = {inputText: '', searchResults: []};
//   }

//   componentDidMount() {
//     this.monsterList = [];
//     for (let i=0,l=this.props.data.allMdx.edges.length;i<l;i++) {
//       let monsters = this.props.data.allMdx.edges[i].node.frontmatter.monsters;
//       for (let x=0,y=monsters.length;x<y;x++) {
//         this.monsterList.push(monsters[x]);
//       }
//     }
//     if (this.props.location.search) {
//       const params = new URLSearchParams(this.props.location.search);
//       this.getResults(params.get('m'), true);
//     }
//   }

//   getResults(query, limit=false) {
//     let results = [];
//     if (!limit) {
//       for (let i=0,l=this.monsterList.length;i<l;i++) {
//         if (this.monsterList[i].name.toUpperCase().includes(query.toUpperCase())) {
//           results.push(this.monsterList[i]);
//         }
//       }
//     } else {
//       results.push(this.monsterList.find(({ name })
// => name.toUpperCase() === query.toUpperCase()));
//     }

//     this.setState({searchResults: results});
//   }

//   handleTextChange(text) {
//     this.setState({inputText: text});
//   }

//   handleSearch(e) {
//     e.preventDefault();

//     if (this.state.inputText) {
//       this.getResults(this.state.inputText);
//     }
//   }

//   render() {
//     const text = this.state.inputText;
//     const results = this.state.searchResults;
//     let searchResults;
//     if (results.length) {
//       searchResults = resultList(results);
//     } else {
//       searchResults = ''
//     }
//     return (
//       <Layout
//         title={'Bestiary'}
//         className={styles.bestiaryWrapper}
//         pageTitle={'Bestiary: DMCM'}
//       >
//         <SearchForm
//           submit={this.handleSearch}
//           textChange={this.handleTextChange}
//           text={text}
//           placeholder='Example'
//         />
//         <div className={styles.searchResults}>
//           {searchResults}
//         </div>
//       </Layout>
//     );
//   }
// };

// export default BeastPage;
