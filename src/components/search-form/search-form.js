import React from 'react';

class SearchTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onTextChange(event.target.value);
  }

  render() {
    const text = this.props.text;
    return (
      <fieldset>
        <label>
          Search:
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

function SearchForm(props) {
  return (
    <form onSubmit={props.submit}>
      <SearchTextInput
        onTextChange={props.textChange}
        text={props.text}
        placeholder={props.placeholder}
      />
      <input
        type='submit'
        value='Submit'
      />
    </form>
  );
}

export default SearchForm;
