// Navigation.js
import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <Menu className="nav-menu" inverted>
      <Menu.Item name="home" as={Link} to="/" activeClassName="active">Home</Menu.Item>
      <Menu.Item name="find-question" as={Link} to="/find-question" activeClassName="active">Find Question</Menu.Item>
      <Menu.Item name="new-post" as={Link} to="/new-post" activeClassName="active">New Post</Menu.Item>
    </Menu>
  );
};

export default Navigation;
