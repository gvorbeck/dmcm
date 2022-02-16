import React from 'react';

function SearchForm() {
  return ('foo');
}

export default SearchForm;

// import * as styles from './search-form.module.scss';

// class SearchTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(event) {
//     this.props.onTextChange(event.target.value);
//   }

//   render() {
//     const text = this.props.text;
//     return (
//       <fieldset>
//         <label className={styles.searchLabel}>
//           Search:
//           <input
//             type='text'
//             value={text}
//             onChange={this.handleChange}
//             placeholder={this.props.placeholder}
//             className={styles.searchInput}
//           />
//         </label>
//       </fieldset>
//     );
//   }
// }

// function SearchForm(props) {
//   return (
//     <form
//       onSubmit={props.submit}
//       className={styles.searchForm}
//     >
//       <SearchTextInput
//         onTextChange={props.textChange}
//         text={props.text}
//         placeholder={props.placeholder}
//       />
//       <input
//         type='submit'
//         value='Submit'
//         className={styles.searchSubmit}
//       />
//     </form>
//   );
// }

// export default SearchForm;
