'use client';
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { CircularProgress, IconButton, Skeleton, Theme, Tooltip, Typography, useTheme } from '@mui/material';
import DataGrid, { type DataGridProps, type DataGridHandle } from 'react-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useTranslation } from '@/i18n/client';
import { HeaderCell } from '@/components/CellRenderers';
import Pagination, { PaginationProps } from '@/components/Pagination';

type StyledDataGridProps = DataGridProps<any> & {
  containerClassName?: string;
  filterEnabled?: boolean;
  filterMenuBottom?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  status?: FetchStatus;
  onFilterToggleBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFilterResetBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
} & (
    | ({
        pagination?: false;
      } & Partial<PaginationProps>)
    | ({
        pagination: true;
      } & PaginationProps)
  );

const Container = styled.div<{ muitheme: Theme }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  gap: 20px;

  .grid-container {
    display: flex;
    height: 100%;
    overflow: hidden;

    .custom-grid {
      border-radius: 5px;
      flex: 1;
      height: 100%;

      .rdg-header,
      .rdg-row {
        transition: line-height 0.5s ease;
      }

      .rdg-row[aria-selected='true'] {
        background-color: ${({ muitheme }) => muitheme.palette.primary.main}AA;
      }

      .rdg-cell {
        &[role='columnheader'] {
          ${({ muitheme }) => (muitheme.palette.mode === 'light' ? 'background-color: #fff;' : '')}
        }

        &[role='gridcell'] {
          border: none;
        }

        &[aria-selected='true'] {
          outline: 2px solid ${({ muitheme }) => muitheme.palette.primary.main};
        }
      }
    }

    .filter-menu {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: ${({ muitheme }) => muitheme.palette.action.hover};
      border: 1px solid
        ${({ muitheme }) => (muitheme.palette.mode === 'dark' ? 'rgb(68, 68, 68)' : 'rgb(221, 221, 221)')};
      border-left: none;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 5px;

      .filter-menu-top,
      .filter-menu-bottom {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    }
  }

  .no-data-container {
    grid-column: 1/-1;

    .no-data-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      p[data-error='true'] {
        color: ${({ muitheme }) => muitheme.palette.error.main};
      }
    }
  }
`;

export const StyledDataGridSkeleton = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Skeleton variant="rounded" animation="pulse" style={{ width: '100%', height: '100%' }} />
      <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    </div>
  );
};

const EmptyRowsRenderer = ({ status }: { status?: FetchStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="no-data-container">
      <div className="no-data-wrapper">
        {status === 'fetching' && <CircularProgress />}
        {status === 'success' && (
          <Typography variant="body2" component="p">
            {t('components.grid.noData')}
          </Typography>
        )}
        {status === 'error' && (
          <Typography variant="body2" component="p" data-error>
            {t('components.grid.error')}
          </Typography>
        )}
      </div>
    </div>
  );
};

const StyledDataGrid = forwardRef<DataGridHandle, StyledDataGridProps>(
  (
    {
      className,
      containerClassName,
      containerStyle,
      renderers,
      filterEnabled,
      filterMenuBottom,
      pagination,
      total,
      page,
      pageSize,
      pageSizeOptions,
      status,
      onFilterToggleBtnClick,
      onFilterResetBtnClick,
      onPageSizeOptionChange,
      onPageChange,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
      <Container muitheme={theme} className={containerClassName} style={containerStyle}>
        <div className="grid-container">
          <DataGrid
            ref={ref}
            {...props}
            columns={props.columns.map(d => ({ ...d, renderHeaderCell: (d as any).renderHeaderCell ?? HeaderCell }))}
            rows={status === 'success' ? props.rows : []}
            className={[className, `rdg-${theme.palette.mode}`, 'custom-grid'].join(' ')}
            defaultColumnOptions={
              props.defaultColumnOptions ?? {
                sortable: true,
                resizable: true
              }
            }
            headerRowHeight={filterEnabled ? 80 : undefined}
            rowHeight={props.rowHeight ?? 40}
            renderers={{
              ...renderers,
              noRowsFallback: renderers?.noRowsFallback || <EmptyRowsRenderer status={status} />
            }}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <div className="filter-menu">
            <div className="filter-menu-top">
              <Tooltip title={t('components.grid.filter')} placement="left">
                <IconButton onClick={onFilterToggleBtnClick}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {filterEnabled ? (
                <Tooltip title={t('components.grid.reset')} placement="left">
                  <IconButton onClick={onFilterResetBtnClick}>
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton onClick={onFilterResetBtnClick} disabled>
                  <BackspaceIcon fontSize="small" style={{ fill: theme.palette.action.disabled }} />
                </IconButton>
              )}
            </div>
            <div className="filter-menu-bottom">{filterMenuBottom}</div>
          </div>
        </div>
        {pagination && (
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            disabled={status !== 'success'}
            onPageSizeOptionChange={onPageSizeOptionChange}
            onPageChange={onPageChange}
          />
        )}
      </Container>
    );
  }
);

StyledDataGrid.displayName = 'StyledDataGrid';

export default StyledDataGrid;
