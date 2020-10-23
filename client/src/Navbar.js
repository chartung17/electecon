import React from 'react';

function Navbar() {
  const navStyle = {
    top: 0,
    width: "100%",
    background: "#cc0000",
    padding: 15,
    textAlign: 'center'
  }

  const linkStyle = {
    padding: 20,
    fontSize: 24,
    color: "white"
  }

  return (
    <nav className="Navbar" style={navStyle} id="navbar">
      <a href="/" style={linkStyle}>Map</a>
      <a href="/graph" style={linkStyle}>Graph</a>
      <a href="/trends" style={linkStyle}>Trends</a>
      <a href="/county" style={linkStyle}>County Details</a>
    </nav>
  );
}

export default Navbar;
