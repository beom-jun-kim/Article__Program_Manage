'use client';
import React from 'react';
import styled from '@emotion/styled';
import { AppBar, IconButton, Theme, Toolbar, Tooltip, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCookies } from 'react-cookie';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTranslation } from '@/i18n/client';
import useUser from '@/app/useUser';
import { cookieName } from '@/i18n/settings';

const StyledAppBar = styled(AppBar)<{ muitheme: Theme }>`
  background-color: transparent;

  .header-toolbar {
    display: flex;
    align-items: center;
    gap: 24px;

    img[alt='logo-img'] {
      cursor: pointer;
    }

    .menu-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      list-style-type: none;
      padding: 0;
      gap: 20px;

      li {
        a {
          text-decoration: none;

          .menu-text {
            width: 70px;
            text-align: center;
          }
        }

        &[data-selected='true'] {
          .menu-text {
            color: ${({ muitheme }) => muitheme.palette.primary.light};
            font-weight: bold;
          }
        }

        .lng-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1em;
          height: 1em;
        }
      }
    }
  }
`;

const MenuItem = ({
  children,
  href = '/',
  selected = false
}: {
  children?: string;
  href?: string;
  selected?: boolean;
}) => (
  <li data-selected={selected}>
    <Link href={href}>
      <Typography className="menu-text">{children}</Typography>
    </Link>
  </li>
);

const Header = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const { i18n, t } = useTranslation();
  const [cookies, setCookies] = useCookies([cookieName, 'theme']);

  const { userInfo } = useUser();

  const handleChangeLang = () => {
    const { lng } = cookies;
    i18n.changeLanguage(lng);
    setCookies('lng', lng === 'ko' ? 'en' : 'ko', { path: '/' });
  };

  const handleChangeTheme = () => {
    setCookies('theme', theme.palette.mode === 'light' ? 'dark' : 'light', { path: '/' });
  };

  const logout = async () => {
    try {
      await axios.post('/api/user/login/logout');
    } catch (err) {
      console.error(err);
    }
    window.location.href = '/';
  };

  return (
    <StyledAppBar position="sticky" muitheme={theme}>
      <Toolbar className="header-toolbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/manage/images/NAWriter_logo.png"
          prefix="/manage"
          alt="logo-img"
          width={100}
          onClick={() => {
            window.location.href = '/';
          }}
        />
        <ul className="menu-wrapper" style={{ flex: 1 }}>
          {(
            [
              userInfo?.userPosType !== 'N' ? { text: t('components.header.menu.manage'), href: '/manage' } : undefined,
              { text: t('components.header.menu.nawriter'), href: '/service/nawriter' },
              { text: t('components.header.menu.myNews'), href: '/service/my-news' },
              { text: t('components.header.menu.setting'), href: '/service/setting' }
            ].filter(Boolean) as { text: string; href: string }[]
          ).map(({ text, href }, i) => (
            <MenuItem key={i} href={href} selected={pathname === href || new RegExp(`^${href}/`).test(pathname)}>
              {text}
            </MenuItem>
          ))}
        </ul>
        <ul className="menu-wrapper" style={{ gap: '5px' }}>
          {process.env.NODE_ENV !== 'production' && (
            <>
              <li>
                <Tooltip title={t('components.header.themeBtnTooltip')}>
                  <IconButton onClick={handleChangeTheme}>
                    <div className="lng-btn">
                      {theme.palette.mode === 'light' && <LightModeIcon />}
                      {theme.palette.mode === 'dark' && <DarkModeIcon />}
                    </div>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title={t('components.header.lngBtnTooltip')}>
                  <IconButton onClick={handleChangeLang}>
                    <div className="lng-btn">
                      <Typography variant="h6">{t('components.header.lngBtnText')}</Typography>
                    </div>
                  </IconButton>
                </Tooltip>
              </li>
            </>
          )}
          <li>
            <Tooltip title={t('components.header.logoutBtnTooltip')}>
              <IconButton onClick={logout}>
                <MeetingRoomIcon />
              </IconButton>
            </Tooltip>
          </li>
        </ul>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
