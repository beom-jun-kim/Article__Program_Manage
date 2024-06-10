'use client';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
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
import { type RenderHeaderCellProps, SelectColumn, type Column, type SortColumn } from 'react-data-grid';
import { toast } from 'react-toastify';
import { format as dateFormat } from 'date-fns';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import { defaultSignupApprovalFilterValue, SignupApprovalFilterContext } from '@/app/manage/signup-approval/contexts';
import { useTranslation } from '@/i18n/client';
import useSignupApprovalData, { type SignupApprovalData } from '@/app/manage/signup-approval/useSignupApprovalData';
import { StyledDataGridSkeleton } from '@/components/StyledDataGrid';
import { ColumnSearchCell, HeaderCell } from '@/components/CellRenderers';

const StyledDataGrid = dynamic(() => import('@/components/StyledDataGrid'), {
  ssr: false,
  loading: StyledDataGridSkeleton
});

const SignupApprovalPage = () => {
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
  const [updateUserDialog, setUpdateUserDialog] = useState<{ open: boolean; data?: string[]; approval: boolean }>({
    open: false,
    data: undefined,
    approval: false
  });

  const { t, lng } = useTranslation();
  const theme = useTheme();

  const { setFilter, ...signupApprovalFilter } = useContext(SignupApprovalFilterContext);

  const searchTimeoutRef = useRef<any>(undefined);

  const { data, status, refetch, updateUser } = useSignupApprovalData({
    lng,
    pagination,
    sortColumns,
    filter: signupApprovalFilter
  });

  const columns: Column<SignupApprovalData>[] = useMemo(
    () => [
      SelectColumn,
      {
        key: 'username',
        name: t('pages.manage.signup-approval.grid.username'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.username,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, username: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'usernameEn',
        name: t('pages.manage.signup-approval.grid.usernameEn'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.usernameEn,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, usernameEn: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'email',
        name: t('pages.manage.signup-approval.grid.email'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 250,
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.email,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, email: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'phone',
        name: t('pages.manage.signup-approval.grid.phone'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.phone,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, phone: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'gender',
        name: t('pages.manage.signup-approval.grid.gender'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 160,
        renderCell: ({ row }) => {
          if (![1002001, 1002002].includes(row.genderSeq as number)) return null;
          return row.genderSeq ? t(`pages.manage.signup-approval.grid.${row.genderSeq}`) : '';
        },
        renderHeaderCell: (props: RenderHeaderCellProps<any>) => {
          return (
            <HeaderCell {...props} filterEnabled>
              <ToggleButtonGroup
                color="primary"
                size="small"
                value={`${signupApprovalFilter.genderSeq || 'all'}`}
                exclusive
              >
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="all"
                  onClick={e => {
                    e.stopPropagation();
                    setFilter({ ...signupApprovalFilter, genderSeq: undefined });
                  }}
                >
                  {t('pages.manage.signup-approval.grid.all')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="1002001"
                  onClick={e => {
                    e.stopPropagation();
                    setFilter({ ...signupApprovalFilter, genderSeq: 1002001 });
                  }}
                >
                  {t('pages.manage.signup-approval.grid.1002001')}
                </ToggleButton>
                <ToggleButton
                  style={{ padding: '2.5px 5px' }}
                  value="1002002"
                  onClick={e => {
                    e.stopPropagation();
                    setFilter({ ...signupApprovalFilter, genderSeq: 1002002 });
                  }}
                >
                  {t('pages.manage.signup-approval.grid.1002002')}
                </ToggleButton>
              </ToggleButtonGroup>
            </HeaderCell>
          );
        }
      },
      {
        key: 'birth',
        name: t('pages.manage.signup-approval.grid.birth'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 120,
        renderCell: ({ row }) => {
          return dateFormat(row.birth!, 'yyyy-MM-dd');
        },
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.birth,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, birth: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'country',
        name: t('pages.manage.signup-approval.grid.country'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 250,
        renderCell: ({ row }) => (lng === 'ko' ? row.country : row.countryEn),
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.country,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, country: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'createDate',
        name: t('pages.manage.signup-approval.grid.createDate'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        minWidth: 120,
        renderCell: ({ row }) => {
          return dateFormat(row.createDate!, 'yyyy-MM-dd');
        },
        renderHeaderCell: ColumnSearchCell({
          enabled: signupApprovalFilter.enabled,
          value: signupApprovalFilter.createDate,
          onChange: e => {
            setFilter({ ...signupApprovalFilter, createDate: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      }
    ],
    [theme.palette.mode, lng, signupApprovalFilter, setFilter, refetch, t]
  );

  useEffect(() => {
    refetch();
  }, [signupApprovalFilter.enabled, signupApprovalFilter.genderSeq, refetch]);

  return (
    <>
      <StyledDataGrid
        rowKeyGetter={row => row.seq}
        containerClassName="manage-grid-container"
        columns={columns}
        rows={data?.contents || []}
        selectedRows={selectedRows}
        sortColumns={sortColumns}
        filterEnabled={signupApprovalFilter.enabled}
        filterMenuBottom={
          <>
            <IconButton
              disabled={!selectedRows.size}
              onClick={() => setUpdateUserDialog({ open: true, data: Array.from(selectedRows), approval: true })}
            >
              <Tooltip title={t('pages.manage.signup-approval.tooltip.signupApproval')} placement="left">
                <PersonAddIcon
                  fontSize="small"
                  style={{ fill: !selectedRows.size ? theme.palette.action.disabled : theme.palette.success.main }}
                />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={!selectedRows.size}
              onClick={() => setUpdateUserDialog({ open: true, data: Array.from(selectedRows), approval: false })}
            >
              <Tooltip title={t('pages.manage.signup-approval.tooltip.signupReject')} placement="left">
                <PersonAddDisabledIcon
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
        onSortColumnsChange={setSortColumns}
        onFilterToggleBtnClick={() => setFilter({ ...signupApprovalFilter, enabled: !signupApprovalFilter.enabled })}
        onFilterResetBtnClick={() => {
          setFilter({
            ...signupApprovalFilter,
            ...defaultSignupApprovalFilterValue,
            enabled: signupApprovalFilter.enabled
          });
          setTimeout(refetch);
        }}
        onPageSizeOptionChange={e => setPagination({ ...pagination, page: 0, pageSize: Number(e.target.value) })}
        onPageChange={(e, page) => setPagination({ ...pagination, page: page - 1 })}
      />
      <Dialog open={updateUserDialog.open}>
        <DialogTitle className="dialog-title">
          {updateUserDialog.approval ? <PersonAddIcon /> : <PersonAddDisabledIcon />}
          <span>
            {t(`pages.manage.signup-approval.dialog.${updateUserDialog.approval ? 'signupApproval' : 'signupReject'}`)}
          </span>
        </DialogTitle>
        <DialogContent>
          {t(
            `pages.manage.signup-approval.dialog.${updateUserDialog.approval ? 'signupApprovalText' : 'signupRejectText'}`,
            {
              replace: { n: updateUserDialog.data?.length }
            }
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateUserDialog({ ...updateUserDialog, open: false })}>
            {t('components.dialog.cancel')}
          </Button>
          <Button
            onClick={async () => {
              if (!updateUserDialog.data) return;
              const code = await updateUser(updateUserDialog.data, updateUserDialog.approval);
              switch (code) {
                case 'warn':
                  toast(
                    t(
                      `pages.manage.signup-approval.toast.${updateUserDialog.approval ? 'signupApprovalFail' : 'signupRejectFail'}`
                    ),
                    { type: 'warning' }
                  );
                  break;
                case 'error':
                  toast(t('components.toast.error'), { type: 'error' });
                  break;
                default:
                  toast(
                    t(
                      `pages.manage.signup-approval.toast.${updateUserDialog.approval ? 'signupApprovalSuccess' : 'signupRejectSuccess'}`,
                      { replace: { n: updateUserDialog.data.length } }
                    ),
                    { type: 'success' }
                  );
              }
              setPagination(prev => ({ ...prev, page: 0 }));
              setSelectedRows(new Set());
              setUpdateUserDialog({ ...updateUserDialog, open: false });
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

export default SignupApprovalPage;
