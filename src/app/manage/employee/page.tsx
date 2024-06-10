'use client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { type RenderHeaderCellProps, SelectColumn, type Column, type SortColumn } from 'react-data-grid';
import { toast } from 'react-toastify';
import { format as dateFormat } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { defaultEmployeeFilterValue, EmployeeFilterContext } from '@/app/manage/employee/contexts';
import { useTranslation } from '@/i18n/client';
import useEmployeeData, { type EmployeeData } from '@/app/manage/employee/useEmployeeData';
import { StyledDataGridSkeleton } from '@/components/StyledDataGrid';
import { ColumnSearchCell, HeaderCell, editCellRenderer } from '@/components/CellRenderers';
import useUser from '@/app/useUser';

const StyledDataGrid = dynamic(() => import('@/components/StyledDataGrid'), {
  ssr: false,
  loading: StyledDataGridSkeleton
});

const EmployeePage = () => {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([
    { columnKey: 'admin', direction: 'DESC' },
    { columnKey: 'empName', direction: 'ASC' }
  ]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100]
  });
  const [adminDialog, setAdminDialog] = useState<{ open: boolean; text: string; data?: EmployeeData }>({
    open: false,
    text: '',
    data: undefined
  });
  const [deptDialog, setDeptDialog] = useState<{ open: boolean; data?: EmployeeData }>({
    open: false,
    data: undefined
  });
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState<{ open: boolean; data?: string[] }>({
    open: false,
    data: undefined
  });

  const { t, lng } = useTranslation();
  const theme = useTheme();

  const { userInfo } = useUser();

  const { setFilter, ...employeeFilter } = useContext(EmployeeFilterContext);

  const searchTimeoutRef = useRef<any>(undefined);

  const { data, status, organizationsTreeData, refetch, updateEmployee, deleteEmployee } = useEmployeeData({
    lng,
    pagination,
    sortColumns,
    filter: employeeFilter
  });

  const columns: Column<EmployeeData>[] = useMemo(
    () => [
      SelectColumn,
      {
        key: 'empName',
        name: t('pages.manage.employee.grid.empName'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.empName,
          onChange: e => {
            setFilter({ ...employeeFilter, empName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'empNameEn',
        width: 200,
        name: t('pages.manage.employee.grid.empNameEn'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.empNameEn,
          onChange: e => {
            setFilter({ ...employeeFilter, empNameEn: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'empId',
        name: t('pages.manage.employee.grid.empId'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.empId,
          onChange: e => {
            setFilter({ ...employeeFilter, empId: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'email',
        name: t('pages.manage.employee.grid.email'),
        width: 250,
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.email,
          onChange: e => {
            setFilter({ ...employeeFilter, email: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'phone',
        name: t('pages.manage.employee.grid.phone'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        minWidth: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.phone,
          onChange: e => {
            setFilter({ ...employeeFilter, phone: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'admin',
        name: t('pages.manage.employee.grid.admin'),
        width: 145,
        cellClass: row => {
          if (row.seq === userInfo?.userId) return `grid-cell-disabled-${theme.palette.mode}`;
          return '';
        },
        renderCell: ({ row }) => {
          const handleChange = () => {
            if (!row.deptSeq) {
              toast(t('pages.manage.employee.toast.noDept'), { type: 'warning' });
              return;
            }
            setAdminDialog({
              open: true,
              text: row.admin
                ? t('pages.manage.employee.dialog.adminText2', {
                    replace: { name: lng === 'ko' ? row.empName : row.empNameEn }
                  })
                : t('pages.manage.employee.dialog.adminText1', {
                    replace: { name: lng === 'ko' ? row.empName : row.empNameEn }
                  }),
              data: row
            });
          };

          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Checkbox checked={row.admin} disabled={row.seq === userInfo?.userId} onChange={handleChange} />
            </div>
          );
        },
        renderHeaderCell: (props: RenderHeaderCellProps<any>) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const filter = useContext(EmployeeFilterContext);

          return (
            <HeaderCell {...props} filterEnabled>
              <ToggleButtonGroup color="primary" size="small" value={filter.admin || 'all'} exclusive>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="all"
                  onClick={(e, value) => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, admin: value });
                  }}
                >
                  {t('pages.manage.employee.grid.all')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="admin"
                  onClick={(e, value) => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, admin: value });
                  }}
                >
                  {t('pages.manage.employee.grid.admin')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="etc"
                  onClick={(e, value) => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, admin: value });
                  }}
                >
                  {t('pages.manage.employee.grid.etc')}
                </ToggleButton>
              </ToggleButtonGroup>
            </HeaderCell>
          );
        }
      },
      {
        key: 'gender',
        name: t('pages.manage.employee.grid.gender'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 160,
        renderCell: ({ row }) => {
          if (![1002001, 1002002].includes(row.genderSeq as number)) return null;
          return row.genderSeq ? t(`pages.manage.employee.grid.${row.genderSeq}`) : '';
        },
        renderHeaderCell: (props: RenderHeaderCellProps<any>) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const filter = useContext(EmployeeFilterContext);

          return (
            <HeaderCell {...props} filterEnabled>
              <ToggleButtonGroup color="primary" size="small" value={`${filter.genderSeq || 'all'}`} exclusive>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="all"
                  onClick={e => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, genderSeq: undefined });
                  }}
                >
                  {t('pages.manage.employee.grid.all')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="1002001"
                  onClick={e => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, genderSeq: 1002001 });
                  }}
                >
                  {t('pages.manage.employee.grid.1002001')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="1002002"
                  onClick={e => {
                    e.stopPropagation();
                    filter.setFilter({ ...filter, genderSeq: 1002002 });
                  }}
                >
                  {t('pages.manage.employee.grid.1002002')}
                </ToggleButton>
              </ToggleButtonGroup>
            </HeaderCell>
          );
        }
      },
      {
        key: 'birth',
        name: t('pages.manage.employee.grid.birth'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 120,
        renderCell: ({ row }) => {
          if (!row.birth) return null;
          return dateFormat(row.birth, 'yyyy-MM-dd');
        },
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.birth,
          onChange: e => {
            setFilter({ ...employeeFilter, birth: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'dept',
        name: t('pages.manage.employee.grid.dept'),
        width: 200,
        renderCell: ({ row }) => {
          const dept = lng === 'ko' ? row.dept : row.deptEn;

          const handleClick = () => {
            setDeptDialog({ open: true, data: row });
          };

          if (!dept) {
            return (
              <Tooltip title={t('pages.manage.employee.tooltip.updateDept')} placement="right">
                <IconButton onClick={handleClick}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            );
          }

          return <Chip label={dept} component="button" variant="outlined" clickable onClick={handleClick} />;
        },
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.dept,
          onChange: e => {
            setFilter({ ...employeeFilter, dept: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'country',
        name: t('pages.manage.employee.grid.country'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        minWidth: 250,
        renderCell: ({ row }) => (lng === 'ko' ? row.country : row.countryEn),
        renderHeaderCell: ColumnSearchCell({
          enabled: employeeFilter.enabled,
          value: employeeFilter.country,
          onChange: e => {
            setFilter({ ...employeeFilter, country: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      }
    ],
    [theme.palette.mode, lng, userInfo?.userId, employeeFilter, setFilter, refetch, t]
  );

  const handleUpdateEmployee = async (data: EmployeeData) => {
    const code = await updateEmployee(data);
    switch (code) {
      case 'warn':
        toast(
          t('pages.manage.employee.toast.updateEmployeeFail', {
            replace: { name: lng === 'ko' ? data.empName : data.empNameEn }
          }),
          { type: 'warning' }
        );
        break;
      case 'error':
        toast(t('components.toast.error'), { type: 'error' });
        break;
      default:
        toast(
          t('pages.manage.employee.toast.updateEmployeeSuccess', {
            replace: { name: lng === 'ko' ? data.empName : data.empNameEn }
          }),
          { type: 'success' }
        );
    }
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [employeeFilter.enabled, employeeFilter.admin, employeeFilter.genderSeq, refetch]);

  return (
    <>
      <StyledDataGrid
        rowKeyGetter={row => row.seq}
        containerClassName="manage-grid-container"
        columns={columns}
        rows={data?.contents || []}
        selectedRows={selectedRows}
        sortColumns={sortColumns}
        filterEnabled={employeeFilter.enabled}
        filterMenuBottom={
          <IconButton
            disabled={!selectedRows.size}
            onClick={() => {
              setDeleteEmployeeDialog({ open: true, data: Array.from(selectedRows) });
            }}
          >
            <Tooltip title={t('pages.manage.employee.tooltip.deleteEmployee')} placement="left">
              <PersonRemoveIcon
                fontSize="small"
                style={{ fill: !selectedRows.size ? theme.palette.action.disabled : theme.palette.error.main }}
              />
            </Tooltip>
          </IconButton>
        }
        pagination
        total={data?.total ?? 0}
        page={pagination.page}
        pageSize={pagination.pageSize}
        pageSizeOptions={pagination.pageSizeOptions}
        status={status}
        onSelectedRowsChange={selectedRows => {
          if (userInfo?.userId) selectedRows.delete(userInfo.userId);
          setSelectedRows(selectedRows);
        }}
        onSortColumnsChange={setSortColumns}
        onRowsChange={(rows, data) => {
          const idx = data.indexes[0];
          if (!rows[idx].deptSeq) {
            toast(t('pages.manage.employee.toast.noDept'), { type: 'warning' });
            return;
          }
          handleUpdateEmployee(rows[idx]);
        }}
        onFilterToggleBtnClick={() => setFilter({ ...employeeFilter, enabled: !employeeFilter.enabled })}
        onFilterResetBtnClick={() => {
          setFilter({ ...employeeFilter, ...defaultEmployeeFilterValue, enabled: employeeFilter.enabled });
          setTimeout(refetch);
        }}
        onPageSizeOptionChange={e => setPagination({ ...pagination, page: 0, pageSize: Number(e.target.value) })}
        onPageChange={(e, page) => setPagination({ ...pagination, page: page - 1 })}
      />
      <Dialog open={adminDialog.open}>
        <DialogTitle className="dialog-title">
          <ManageAccountsIcon />
          <span>{t('pages.manage.employee.dialog.updateEmployeeTitle')}</span>
        </DialogTitle>
        <DialogContent>{adminDialog.text}</DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminDialog({ ...adminDialog, open: false, data: undefined })}>
            {t('components.dialog.cancel')}
          </Button>
          <Button
            onClick={async () => {
              if (!adminDialog.data) return;
              handleUpdateEmployee({ ...adminDialog.data, admin: !adminDialog.data.admin });
              setAdminDialog({ ...adminDialog, open: false, data: undefined });
            }}
          >
            {t('components.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deptDialog.open}>
        <DialogTitle className="dialog-title">
          <AccountTreeIcon />
          <span>{t('pages.manage.employee.dialog.organizationChart')}</span>
        </DialogTitle>
        <DialogContent>
          <RichTreeView
            expandedItems={['root']}
            selectedItems={deptDialog.data?.deptSeq ? `${deptDialog.data.deptSeq}` : undefined}
            items={organizationsTreeData}
            onSelectedItemsChange={(_, id) => {
              deptDialog.data &&
                id !== 'root' &&
                setDeptDialog({ ...deptDialog, data: { ...deptDialog.data, deptSeq: Number(id) } });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeptDialog({ ...deptDialog, open: false })}>{t('components.dialog.cancel')}</Button>
          <Button
            onClick={() => {
              if (!deptDialog.data) return;
              handleUpdateEmployee({ ...deptDialog.data, deptSeq: deptDialog.data.deptSeq });
              setDeptDialog({ ...deptDialog, open: false });
            }}
          >
            {t('components.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteEmployeeDialog.open}>
        <DialogTitle className="dialog-title">
          <PersonRemoveIcon />
          <span>{t('pages.manage.employee.dialog.deleteEmployeeTitle')}</span>
        </DialogTitle>
        <DialogContent>
          {t('pages.manage.employee.dialog.deleteEmployeeText', { replace: { n: deleteEmployeeDialog.data?.length } })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteEmployeeDialog({ ...deleteEmployeeDialog, open: false })}>
            {t('components.dialog.cancel')}
          </Button>
          <Button
            onClick={async () => {
              try {
                if (!deleteEmployeeDialog.data) return;
                await deleteEmployee(deleteEmployeeDialog.data);
                toast(t('pages.manage.employee.toast.deleteEmployeeSuccess'), { type: 'success' });
              } catch (err) {
                console.error(err);
                toast(t('pages.manage.employee.toast.deleteEmployeeError'), { type: 'error' });
              }
              setPagination(prev => ({ ...prev, page: 0 }));
              setDeleteEmployeeDialog({ ...deleteEmployeeDialog, open: false });
              setSelectedRows(new Set());
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

export default EmployeePage;
