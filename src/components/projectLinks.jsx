/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';

import LinkWithIcon from './linkWithIcon';

const ProjectLinks = ({ links }) => {
  return (
    <span
      sx={{
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
      }}
    >
      {links.map((link, index) => (
        <span key={link.url}>
          <LinkWithIcon {...link} />
          {index < links.length - 1 && <>&nbsp;·&nbsp;</>}
        </span>
      ))}
    </span>
  );
};

export default ProjectLinks;
