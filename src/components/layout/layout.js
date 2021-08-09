import React from 'react';
import * as styles from './layout.module.scss';

function Layout(props) {
  const pageWrapperClasses = [styles.pageWrapper, props.pageWrapper, 'dmcm--pageWrapper'].join(' ');
  return (
    <div
      className={pageWrapperClasses}
    >
      <main>
        {props.children}
      </main>
    </div>
  );
}

export default Layout;