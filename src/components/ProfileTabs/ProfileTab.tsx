import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { TabProps } from '@mui/material';

const ProfileTabRoot = styled(Tab)({
  ':focus-visible': {
    outline: 'unset',
  },
  ':focus': {
    outline: 'unset',
  },
});

export const ProfileTab = (props: TabProps) => <ProfileTabRoot {...props} />;
