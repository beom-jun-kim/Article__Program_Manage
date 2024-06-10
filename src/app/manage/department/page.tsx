'use client';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material';
import { SelectColumn, type Column } from 'react-data-grid';
import { toast } from 'react-toastify';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { defaultDepartmentFilterValue, DepartmentFilterContext } from '@/app/manage/department/contexts';
import { useTranslation } from '@/i18n/client';
import useDepartmentData, { type DepartmentData } from '@/app/manage/department/useDepartmentData';
import { StyledDataGridSkeleton } from '@/components/StyledDataGrid';
import { ColumnSearchCell, editCellRenderer } from '@/components/CellRenderers';

const StyledDataGrid = dynamic(() => import('@/components/StyledDataGrid'), {
  ssr: false,
  loading: StyledDataGridSkeleton
});

const defaultNewDeptDialogError: {
  deptName: boolean;
  deptNameEn: boolean;
  deptPhone: boolean;
  deptFax: boolean;
} = {
  deptName: false,
  deptNameEn: false,
  deptPhone: false,
  deptFax: false
};

const DepartmentPage = () => {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100]
  });
  const [newDeptDialog, setNewDeptDialog] = useState<{
    open: boolean;
    error: {
      deptName: boolean;
      deptNameEn: boolean;
      deptPhone: boolean;
      deptFax: boolean;
    };
  }>({
    open: false,
    error: defaultNewDeptDialogError
  });
  const [checkEmployeeExistsDialog, setCheckEmployeeExistsDialog] = useState({
    open: false
  });

  const { t, lng } = useTranslation();
  const theme = useTheme();

  const { setFilter, ...departmentFilter } = useContext(DepartmentFilterContext);

  const searchTimeoutRef = useRef<any>(undefined);

  const { data, status, refetch, createDepartment, checkEmployeeExists, updateDepartment, deleteDepartment } =
    useDepartmentData({
      lng,
      pagination,
      filter: departmentFilter
    });

  const handleUpdateDepartment = useCallback(
    async (data: DepartmentData) => {
      const code = await updateDepartment(data);
      switch (code) {
        case 'warn':
          toast(t('pages.manage.department.toast.updateDepartmentFail'), { type: 'warning' });
          break;
        case 'error':
          toast(t('components.toast.error'), { type: 'error' });
          break;
        default:
          toast(t('pages.manage.department.toast.updateDepartmentSuccess'), { type: 'success' });
      }
      refetch();
    },
    [updateDepartment, refetch, t]
  );

  const columns: Column<DepartmentData>[] = useMemo(
    () => [
      SelectColumn,
      {
        key: 'deptLevel',
        name: t('pages.manage.department.grid.deptLevel'),
        sortable: false,
        width: 120,
        renderCell: ({ row }) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{row.deptLevel}</span>
              <div>
                <IconButton
                  size="small"
                  disabled={row.deptLevel === 1}
                  onClick={() => handleUpdateDepartment({ ...row, deptLevel: row.deptLevel - 1 })}
                >
                  <ArrowDropUpIcon style={{ fill: row.deptLevel === 1 ? theme.palette.action.disabled : undefined }} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={row.deptLevel === (data?.total || 0)}
                  onClick={() => handleUpdateDepartment({ ...row, deptLevel: row.deptLevel + 1 })}
                >
                  <ArrowDropDownIcon
                    style={{ fill: row.deptLevel === (data?.total || 0) ? theme.palette.action.disabled : undefined }}
                  />
                </IconButton>
              </div>
            </div>
          );
        }
      },
      {
        key: 'deptName',
        name: t('pages.manage.department.grid.deptName'),
        sortable: false,
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: departmentFilter.enabled,
          value: departmentFilter.deptName,
          onChange: e => {
            setFilter({ ...departmentFilter, deptName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'deptNameEn',
        name: t('pages.manage.department.grid.deptNameEn'),
        sortable: false,
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: departmentFilter.enabled,
          value: departmentFilter.deptNameEn,
          onChange: e => {
            setFilter({ ...departmentFilter, deptNameEn: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'deptPhone',
        name: t('pages.manage.department.grid.deptPhone'),
        sortable: false,
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: departmentFilter.enabled,
          value: departmentFilter.deptPhone,
          onChange: e => {
            setFilter({ ...departmentFilter, deptPhone: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'deptFax',
        name: t('pages.manage.department.grid.deptFax'),
        sortable: false,
        minWidth: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: departmentFilter.enabled,
          value: departmentFilter.deptFax,
          onChange: e => {
            setFilter({ ...departmentFilter, deptFax: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      }
    ],
    [theme.palette.action.disabled, data?.total, departmentFilter, setFilter, refetch, handleUpdateDepartment, t]
  );

  useEffect(() => {
    refetch();
  }, [departmentFilter.enabled, refetch]);

  return (
    <>
      <StyledDataGrid
        rowKeyGetter={row => row.seq}
        containerClassName="manage-grid-container"
        columns={columns}
        rows={data?.contents || []}
        selectedRows={selectedRows}
        filterEnabled={departmentFilter.enabled}
        filterMenuBottom={
          <>
            <IconButton onClick={() => setNewDeptDialog({ open: true, error: defaultNewDeptDialogError })}>
              <Tooltip title={t('pages.manage.department.tooltip.createDepartment')} placement="left">
                <GroupAddIcon fontSize="small" style={{ fill: theme.palette.info.main }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={!selectedRows.size}
              onClick={async () => {
                const code = await checkEmployeeExists(Array.from(selectedRows));
                switch (code) {
                  case 'warn':
                    return toast(t('pages.manage.department.toast.checkEmployeeCheckFail'), { type: 'warning' });
                  case 'error':
                    return toast(t('components.toast.error'), { type: 'error' });
                }
                setCheckEmployeeExistsDialog({ open: true });
              }}
            >
              <Tooltip title={t('pages.manage.department.tooltip.deleteDepartment')} placement="left">
                <GroupRemoveIcon
                  fontSize="small"
                  style={{ fill: !selectedRows.size ? theme.palette.action.disabled : theme.palette.error.main }}
                />
              </Tooltip>
            </IconButton>
          </>
        }
        pagination
        total={data?.total ?? 0}
        page={pagination.page}
        pageSize={pagination.pageSize}
        pageSizeOptions={pagination.pageSizeOptions}
        status={status}
        onSelectedRowsChange={setSelectedRows}
        onRowsChange={(rows, data) => {
          const idx = data.indexes[0];
          handleUpdateDepartment(rows[idx]);
        }}
        onFilterToggleBtnClick={() => setFilter({ ...departmentFilter, enabled: !departmentFilter.enabled })}
        onFilterResetBtnClick={() => {
          setFilter({ ...departmentFilter, ...defaultDepartmentFilterValue, enabled: departmentFilter.enabled });
          setTimeout(refetch);
        }}
        onPageSizeOptionChange={e => setPagination({ ...pagination, page: 0, pageSize: Number(e.target.value) })}
        onPageChange={(e, page) => setPagination({ ...pagination, page: page - 1 })}
      />
      <Dialog
        component="form"
        open={newDeptDialog.open}
        onSubmit={async e => {
          e.preventDefault();
          const $form = e.currentTarget as any as HTMLFormElement;
          const data: DepartmentData = Object.fromEntries(new FormData($form));
          const { deptName, deptNameEn, deptPhone, deptFax } = data;

          if (!deptName || !deptNameEn || !deptPhone || !deptFax) {
            setNewDeptDialog(prev => ({
              ...prev,
              error: {
                deptName: !deptName,
                deptNameEn: !deptNameEn,
                deptPhone: !deptPhone,
                deptFax: !deptFax
              }
            }));
            return;
          }

          const code = await createDepartment(data);
          switch (code) {
            case 'warn':
              toast(t('pages.manage.department.toast.createDepartmentFail'), { type: 'warning' });
              break;
            case 'error':
              toast(t('components.toast.error'), { type: 'error' });
              break;
            default:
              toast(t('pages.manage.department.toast.createDepartmentSuccess'), { type: 'success' });
          }
          setNewDeptDialog(prev => ({ ...prev, open: false }));
          refetch();
        }}
      >
        <DialogTitle className="dialog-title">
          <GroupAddIcon />
          <span>{t('pages.manage.department.tooltip.createDepartment')}</span>
        </DialogTitle>
        <DialogContent
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', overflow: 'visible' }}
        >
          <TextField
            size="small"
            name="deptName"
            label={t('pages.manage.department.grid.deptName')}
            error={newDeptDialog.error.deptName}
            onChange={() => setNewDeptDialog(prev => ({ ...prev, error: { ...prev.error, deptName: false } }))}
          />
          <TextField
            size="small"
            name="deptNameEn"
            label={t('pages.manage.department.grid.deptNameEn')}
            error={newDeptDialog.error.deptNameEn}
            onChange={() => setNewDeptDialog(prev => ({ ...prev, error: { ...prev.error, deptNameEn: false } }))}
          />
          <TextField
            size="small"
            name="deptPhone"
            label={t('pages.manage.department.grid.deptPhone')}
            error={newDeptDialog.error.deptPhone}
            onChange={() => setNewDeptDialog(prev => ({ ...prev, error: { ...prev.error, deptPhone: false } }))}
          />
          <TextField
            size="small"
            name="deptFax"
            label={t('pages.manage.department.grid.deptFax')}
            error={newDeptDialog.error.deptFax}
            onChange={() => setNewDeptDialog(prev => ({ ...prev, error: { ...prev.error, deptFax: false } }))}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={e => setNewDeptDialog(prev => ({ ...prev, open: false }))}>
            {t('components.dialog.close')}
          </Button>
          <Button type="submit">{t('components.dialog.confirm')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={checkEmployeeExistsDialog.open}>
        <DialogTitle className="dialog-title">
          <GroupRemoveIcon />
          <span>{t('pages.manage.department.tooltip.deleteDepartment')}</span>
        </DialogTitle>
        <DialogContent>
          {t('pages.manage.department.dialog.deleteDepartmentText', { replace: { n: selectedRows.size } })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckEmployeeExistsDialog({ open: false })}>{t('components.dialog.cancel')}</Button>
          <Button
            onClick={async () => {
              const code = await deleteDepartment(Array.from(selectedRows));
              switch (code) {
                case 'warn':
                  toast(t('pages.manage.department.toast.deleteEmployeeFail'), { type: 'warning' });
                  break;
                case 'error':
                  toast(t('components.toast.error'), { type: 'error' });
                  break;
                default:
                  toast(t('pages.manage.department.toast.deleteEmployeeSuccess', { n: selectedRows.size }), {
                    type: 'success'
                  });
              }
              setPagination(prev => ({ ...prev, page: 0 }));
              setSelectedRows(new Set());
              setCheckEmployeeExistsDialog({ open: false });
              refetch();
            }}
          >
            {t('components.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepartmentPage;
