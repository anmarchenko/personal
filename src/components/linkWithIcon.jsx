import * as React from 'react';

import { GitHub } from 'react-feather';

const types = {
  github: {
    Icon: GitHub,
  },
};

const linkStyles = {
  display: 'inline',
};

const iconStyles = {
  marginRight: '.5ch',
  height: '1.2em',
  verticalAlign: 'middle',
};

const LinkWithIcon = ({ url, type, label }) => {
  if (!types[type]) {
    return null;
  }
  const Icon = types[type].Icon;
  return (
    <a href={url} style={linkStyles}>
      <Icon style={iconStyles} />
      {label}
    </a>
  );
};

export default LinkWithIcon;
