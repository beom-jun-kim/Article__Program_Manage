import React from 'react';
import styled from '@emotion/styled';
import { MenuItem, Pagination as MuiPagination, Select, SelectChangeEvent, Typography } from '@mui/material';
import clamp from 'lodash/clamp';
import { useTranslation } from '@/i18n/client';

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  disabled?: boolean;
  onPageSizeOptionChange?: (event: SelectChangeEvent<number>, child: React.ReactNode) => void;
  onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .page-size-options {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    gap: 10px;
  }

  .page-info {
    position: absolute;
    right: 0;
  }
`;

const Pagination = ({
  total = 0,
  page = 1,
  pageSize = 1,
  pageSizeOptions,
  disabled,
  onPageSizeOptionChange,
  onPageChange
}: PaginationProps) => {
  const { t } = useTranslation();

  return (
    <Container>
      {pageSizeOptions && (
        <div className="page-size-options">
          <Select
            variant="standard"
            size="small"
            value={pageSize}
            onChange={onPageSizeOptionChange}
            SelectDisplayProps={{ style: { paddingLeft: '10px', paddingTop: '4px', backgroundColor: 'transparent' } }}
            disabled={disabled}
          >
            {pageSizeOptions.map((d, i) => (
              <MenuItem key={i} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2">{t('components.pagination.items')}</Typography>
        </div>
      )}
      <MuiPagination page={page + 1} count={Math.ceil(total / pageSize)} disabled={disabled} onChange={onPageChange} />
      {!disabled && (
        <Typography className="page-info" variant="body2">
          {t('components.pagination.of', {
            replace: { a: total, b: `${page * pageSize + 1}-${clamp((page + 1) * pageSize, 1, total)}` }
          })}
        </Typography>
      )}
    </Container>
  );
};

export default Pagination;
