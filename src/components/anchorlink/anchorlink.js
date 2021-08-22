import React from 'react';

function AnchorLink(props) {
  return (
    <a
      href='!#'
      id={props.id}
      dangerouslySetInnerHTML={{ __html: '&nbsp;' }}
      aria-label='Anchor link'
      className='dmcm--anchor-link'
    />
  );
}

export default AnchorLink;
