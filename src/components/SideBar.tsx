'use client';
import React from 'react';
import styled from '@emotion/styled';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/client';

interface ListItemData {
  icon?: React.ReactNode;
  textKey: string;
  href?: string;
  selected?: boolean;
}

const StyledDrawer = styled(Drawer)`
  width: 240px;

  .sidebar-paper {
    position: relative;
    border-right: none;

    .sidebar-list {
      display: flex;
      flex-direction: column;
      padding: 0;
      gap: 10px;

      .sidebar-item-btn {
        border-radius: 5px;
        gap: 10px;
      }
    }
  }
`;

const SideBar = ({ items }: { items: ListItemData[] }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <StyledDrawer variant="permanent" PaperProps={{ className: 'sidebar-paper' }}>
      <List className="sidebar-list">
        {items.map(({ icon, textKey, href, selected = false }, i) => {
          return (
            <ListItemButton
              key={i}
              className="sidebar-item-btn"
              onClick={() => href && router.push(href)}
              selected={selected}
            >
              {icon}
              <ListItemText disableTypography={false}>{t(textKey)}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </StyledDrawer>
  );
};

export default SideBar;
