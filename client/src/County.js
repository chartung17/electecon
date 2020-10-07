import React from 'react';
import { Redirect } from 'react-router-dom';

function County() {
  // find county fips code at end of url, e.g. /county/12345
  var path = window.location.pathname;
  var loc = path.indexOf("county/");
  var fips;
  if (loc < 0) {
    // if fips not specified, default to 01001
    fips = "01001";
  } else {
    fips = path.slice(loc + 7);
  }
  // redirect to /county if fips is invalid or not in database
  if (!fips.match(/^\d{5}$/)) {
    return (<Redirect to="/county" />);
  }

  return (
    <div>
      <h1>FIPS: {fips}</h1>
      <h4>(enter fips at end of url, e.g. /county/12345 - default is 01001)</h4>
    </div>
  );
}

export default County;
