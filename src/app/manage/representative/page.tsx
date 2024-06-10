'use client';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material';
import { SortColumn, type Column } from 'react-data-grid';
import { toast } from 'react-toastify';
import { defaultRepresentativeFilterValue, RepresentativeFilterContext } from '@/app/manage/representative/contexts';
import { useTranslation } from '@/i18n/client';
import useRepresentativeData, { type RepresentativeData } from '@/app/manage/representative/useRepresentativeData';
import { StyledDataGridSkeleton } from '@/components/StyledDataGrid';
import { ColumnSearchCell, editCellRenderer } from '@/components/CellRenderers';

const StyledDataGrid = dynamic(() => import('@/components/StyledDataGrid'), {
  ssr: false,
  loading: StyledDataGridSkeleton
});

const RepresentativePage = () => {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100]
  });
  const [updateTypeDialog, setUpdateTypeDialog] = useState<{
    open: boolean;
    data?: RepresentativeData;
    key?: 'custCompanyType' | 'companyType' | 'custStatus';
    default?: number;
  }>({
    open: false,
    data: undefined,
    key: undefined,
    default: undefined
  });

  const { t, lng } = useTranslation();
  const theme = useTheme();

  const { setFilter, ...representativeFilter } = useContext(RepresentativeFilterContext);

  const searchTimeoutRef = useRef<any>(undefined);

  const { data, status, refetch, updateRepresentative } = useRepresentativeData({
    lng,
    pagination,
    sortColumns,
    filter: representativeFilter
  });

  const columns: Column<RepresentativeData>[] = useMemo(
    () => [
      // SelectColumn,
      {
        key: 'companyName',
        name: t('pages.manage.representative.grid.companyName'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.companyName,
          onChange: e => {
            setFilter({ ...representativeFilter, companyName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custEmpName',
        name: t('pages.manage.representative.grid.custEmpName'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.custEmpName,
          onChange: e => {
            setFilter({ ...representativeFilter, custEmpName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custEmpTel',
        name: t('pages.manage.representative.grid.custEmpTel'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.custEmpTel,
          onChange: e => {
            setFilter({ ...representativeFilter, custEmpTel: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custEmpFax',
        name: t('pages.manage.representative.grid.custEmpFax'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.custEmpFax,
          onChange: e => {
            setFilter({ ...representativeFilter, custEmpFax: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custEmpEmail',
        name: t('pages.manage.representative.grid.custEmpEmail'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.custEmpEmail,
          onChange: e => {
            setFilter({ ...representativeFilter, custEmpEmail: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custEmpPosition',
        name: t('pages.manage.representative.grid.custEmpPosition'),
        minWidth: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: representativeFilter.enabled,
          value: representativeFilter.custEmpPosition,
          onChange: e => {
            setFilter({ ...representativeFilter, custEmpPosition: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      }
    ],
    [theme.palette.mode, representativeFilter, setFilter, refetch, t]
  );

  const handleUpdateRepresentative = useCallback(
    async (data: RepresentativeData) => {
      const code = await updateRepresentative(data);
      switch (code) {
        case 'warn':
          toast(t('pages.manage.representative.toast.updateRepresentativeFail'), { type: 'warning' });
          break;
        case 'error':
          toast(t('components.toast.error'), { type: 'error' });
          break;
        default:
          toast(t('pages.manage.representative.toast.updateRepresentativeSuccess'), { type: 'success' });
      }
      refetch();
    },
    [updateRepresentative, refetch, t]
  );

  useEffect(() => {
    refetch();
  }, [representativeFilter.enabled, refetch]);

  return (
    <>
      <StyledDataGrid
        rowKeyGetter={row => row.companySeq}
        containerClassName="manage-grid-container"
        columns={columns}
        rows={data?.contents || []}
        selectedRows={selectedRows}
        sortColumns={sortColumns}
        filterEnabled={representativeFilter.enabled}
        pagination
        total={data?.total ?? 0}
        page={pagination.page}
        pageSize={pagination.pageSize}
        pageSizeOptions={pagination.pageSizeOptions}
        status={status}
        onSelectedRowsChange={setSelectedRows}
        onSortColumnsChange={setSortColumns}
        onRowsChange={(rows, data) => {
          const idx = data.indexes[0];
          handleUpdateRepresentative(rows[idx]);
        }}
        onFilterToggleBtnClick={() => setFilter({ ...representativeFilter, enabled: !representativeFilter.enabled })}
        onFilterResetBtnClick={() => {
          setFilter({
            ...representativeFilter,
            ...defaultRepresentativeFilterValue,
            enabled: representativeFilter.enabled
          });
          setTimeout(refetch);
        }}
        onPageSizeOptionChange={e => setPagination({ ...pagination, page: 0, pageSize: Number(e.target.value) })}
        onPageChange={(e, page) => setPagination({ ...pagination, page: page - 1 })}
      />
    </>
  );
};

export default RepresentativePage;
