'use client';
import React, { useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import SideBar from '@/components/SideBar';
import { Breadcrumbs, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Groups3Icon from '@mui/icons-material/Groups3';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from '@/i18n/client';
import useUser from '@/app/useUser';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  overflow: hidden;

  .contents {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    overflow: hidden;
    gap: 20px;

    .contents-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .contents-title {
        display: flex;
        align-items: center;
        gap: 10px;

        .sidebar-icon {
          width: 32px;
          height: 32px;
        }
      }

      .contents-header-breadcrumbs {
        .breadcrumbs-item {
          display: flex;
          align-items: center;
          gap: 5px;

          .breadcrumbs-icon {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
`;

const ManageLayout = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const { userInfo, isError } = useUser();

  const sidebarItems = useMemo(
    () =>
      userInfo?.userPosType
        ? ([
            {
              icon: <PersonIcon className="sidebar-icon" />,
              textKey: 'pages.manage.employee.title',
              href: '/manage/employee'
            },
            {
              icon: <GroupsIcon className="sidebar-icon" />,
              textKey: 'pages.manage.department.title',
              href: '/manage/department'
            },
            {
              icon: <HowToRegIcon className="sidebar-icon" />,
              textKey: 'pages.manage.signup-approval.title',
              href: '/manage/signup-approval'
            },
            userInfo?.userPosType === 'G'
              ? {
                  icon: <ApartmentIcon className="sidebar-icon" />,
                  textKey: 'pages.manage.customer.title',
                  href: '/manage/customer'
                }
              : null,
            userInfo?.userPosType === 'G'
              ? {
                  icon: <Groups3Icon className="sidebar-icon" />,
                  textKey: 'pages.manage.representative.title',
                  href: '/manage/representative'
                }
              : null,
            {
              icon: <DataUsageIcon className="sidebar-icon" />,
              textKey: 'pages.manage.usage.title',
              href: '/manage/usage'
            }
          ].filter(Boolean) as { icon: React.JSX.Element; textKey: string; href: string }[])
        : [],
    [userInfo?.userPosType]
  );

  const items = sidebarItems.map(d => ({
    ...d,
    selected: pathname === d.href || new RegExp(`^${d.href}/`).test(pathname)
  }));
  const selectedItem = items.find(d => d.selected);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (!userInfo) {
        if (isError) router.push('/');
        return;
      }
      if (userInfo.userPosType === 'N') {
        router.push('/');
        return;
      }
    }
    if (!/^\/manage\//.test(pathname)) router.replace('/manage/employee');
  }, [router, pathname, userInfo, isError]);

  if (!userInfo || userInfo.userPosType === 'N') return;

  return (
    <Container>
      <div className="sidebar-wrapper">
        <SideBar items={items} />
      </div>
      <div className="contents">
        {selectedItem && (
          <div className="contents-header">
            <div className="contents-title">
              {selectedItem.icon}
              <Typography variant="h5">{t(selectedItem.textKey)}</Typography>
            </div>
            <Breadcrumbs className="contents-header-breadcrumbs">
              <div className="breadcrumbs-item">
                <HomeIcon className="breadcrumbs-icon" />
                <Typography variant="body2">Home</Typography>
              </div>
              <div className="breadcrumbs-item">
                <MenuIcon className="breadcrumbs-icon" />
                <Typography variant="body2">{t('components.header.menu.manage')}</Typography>
              </div>
              <div className="breadcrumbs-item">
                {selectedItem.icon}
                <Typography variant="body2">{t(`${selectedItem.textKey}`)}</Typography>
              </div>
            </Breadcrumbs>
          </div>
        )}
        {children}
      </div>
    </Container>
  );
};

export default ManageLayout;
