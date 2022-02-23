import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function SearchForm(props) {
  const [searchValue, setSearchValue] = useState('');
  const { onSubmit, searchData, searchParams } = props;
  const formattedSearchData = {
    monsters: [],
    spells: [],
  };

  if (searchParams.category) {
    searchData.allMdx.edges.forEach((source) => {
      const content = source.node.frontmatter;
      if (content.monsters && searchParams.category === 'monsters') {
        content.monsters.forEach((monster) => {
          formattedSearchData.monsters.push(monster);
        });
      }
      if (content.spells && searchParams.category === 'spells') {
        content.spells.forEach((spell) => {
          formattedSearchData.spells.push(spell);
        });
      }
    });
  } else {
    console.error('DMCM ERROR: URL Param: \'category\' is missing. Search will not work.');
  }

  if (searchParams.category === 'monsters') {
    formattedSearchData.monsters.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchParams.category === 'spells') {
    formattedSearchData.spells.sort((a, b) => a.name.localeCompare(b.name));
  }
  console.log(formattedSearchData);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(searchValue, searchData);
  };

  return (
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
  );
}
