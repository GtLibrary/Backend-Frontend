import React from 'react';
import Layout from './shared/layout';

const NotFound = () => {
  const style = {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '24px',
    paddingTop: '150px'
  }
  const maindivstyle = {
    minHeight: 'calc(100vh - 154px)',
  }

  return (
    <Layout>
      <div style={maindivstyle}>
        <p style={style}>Unfortunately we can't find that page</p>
      </div>
    </Layout>
  );
}

export default NotFound;