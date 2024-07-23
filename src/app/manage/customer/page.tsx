'use client';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material';
import styled from '@emotion/styled';
import { RenderHeaderCellProps, SelectColumn, SortColumn, type Column } from 'react-data-grid';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// custom
import { defaultCustomerFilterValue, CustomerFilterContext } from '@/app/manage/customer/contexts';
import { useTranslation } from '@/i18n/client';
import useCustomerData, { type CustomerData } from '@/app/manage/customer/useCustomerData';
import { StyledDataGridSkeleton } from '@/components/StyledDataGrid';
import { ColumnSearchCell, HeaderCell, editCellRenderer } from '@/components/CellRenderers';

const StyledDataGrid = dynamic(() => import('@/components/StyledDataGrid'), {
  ssr: false,
  loading: StyledDataGridSkeleton
});

const defaultNewCustomerDialogError = {
  companyName: false,
  companyShortName: false,
  custCompanyTypeSeq: false,
  companyTypeSeq: false,
  companyNo: false,
  ownerName: false,
  custStatusSeq: false,
  tel: false,
  email: false
};

const EditTypeCellWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;

  .edit-btn {
    visibility: hidden;
  }

  &:hover {
    .edit-btn {
      visibility: visible;
    }
  }
`;

const CustomerPage = () => {
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100]
  });

  const [detailDialog, setDetailDialog] = useState<{ 
    open: boolean;
    data?: CustomerData
  }>({ 
    open: false 
  });
  const handleOpenDetailsDialog = (rowData: CustomerData) => {
    setDetailDialog({ open: true, data: rowData });
  };
  const handleCloseDetailsDialog = () => {
    setDetailDialog({ open: false, data: undefined });
  };

  const handleDetailChange = (key: keyof CustomerData, value: string | number) => {
    setDetailDialog((prev) => ({
      ...prev,
      data: {
        ...prev.data!,
        [key]: value,
      },
    }));
  };

  const handleSaveDetails = async () => {
    if (detailDialog.data) {
      try {
        const result = await updateCustomer(detailDialog.data);
        if (result === 'success') {
          handleCloseDetailsDialog();
          refetch();
        } else {
          console.warn('Failed to update customer');
        }
      } catch (error) {
        console.error('Error saving data', error);
      }
    }
  };

  const [newCustomerDialog, setNewCustomerDialog] = useState({
    open: false,
    error: defaultNewCustomerDialogError
  });
  const [deleteCustomerDialog, setDeleteCustomerDialog] = useState<{ open: boolean }>({
    open: false
  });
  const [updateTypeDialog, setUpdateTypeDialog] = useState<{
    open: boolean;
    data?: CustomerData;
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

  const { setFilter, ...customerFilter } = useContext(CustomerFilterContext);

  const searchTimeoutRef = useRef<any>(undefined);

  const { data, status, refetch, minor, country, createCustomer, updateCustomer, deleteCustomer } = useCustomerData({
    lng,
    pagination,
    sortColumns,
    filter: customerFilter
  });
  
  const statusOptions = minor?.custStatus.map(({ seq, remark }) => ({ value: seq, label: remark })) || [];
  const companyTypeOptions = minor?.companyType.map(({ seq, remark }) => ({ value: seq, label: remark })) || [];
  const custCompanyTypeOptions = minor?.custCompanyType.map(({ seq, remark }) => ({ value: seq, label: remark })) || [];
  const domForOptions = minor?.domFor.map(({ seq, remark }) => ({ value: seq, label: remark })) || [];
  const countryNameOptions = country?.map(({ countrySeq, countryName }) => ({
    value: countrySeq,
    label: countryName
  })) || [];  

  const handleUpdateCustomer = useCallback(
    async (data: CustomerData) => {
      const code = await updateCustomer(data);
      switch (code) {
        case 'warn':
          toast(t('pages.manage.customer.toast.updateCustomerFail'), { type: 'warning' });
          break;
        case 'error':
          toast(t('components.toast.error'), { type: 'error' });
          break;
        default:
          toast(t('pages.manage.customer.toast.updateCustomerSuccess'), { type: 'success' });
      }
      refetch();
    },
    [updateCustomer, refetch, t]
  );

  const columns: Column<CustomerData>[] = useMemo(
    () => [
      SelectColumn,
      {
        key: 'companyName',
        name: t('pages.manage.customer.grid.companyName'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.companyName,
          onChange: e => {
            setFilter({ ...customerFilter, companyName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'companyShortName',
        name: t('pages.manage.customer.grid.companyShortName'),
        cellClass: `grid-cell-disabled-${theme.palette.mode}`,
        width: 200,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.companyShortName,
          onChange: e => {
            setFilter({ ...customerFilter, companyShortName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custCompanyTypeSeq',
        name: t('pages.manage.customer.grid.custCompanyType'),
        width: 200,
        renderCell: ({ row }) => {
          const handleClick = () =>
            setUpdateTypeDialog({ open: true, data: row, key: 'custCompanyType', default: row.custCompanyTypeSeq });

          return (
            <EditTypeCellWrapper>
              <span>{minor?.custCompanyType.find(({ seq }) => seq === row.custCompanyTypeSeq)?.remark || ''}</span>
              <div className="edit-btn">
                <Tooltip title={t('pages.manage.customer.tooltip.updateCustomerCompanyType')} placement="right">
                  <IconButton onClick={handleClick}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </EditTypeCellWrapper>
          );
        },
        renderHeaderCell: ({ ...props }: RenderHeaderCellProps<any>) =>
          minor ? (
            <HeaderCell {...props} filterEnabled={customerFilter.enabled}>
              <FormControl
                style={{ width: '100%', height: '30px' }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                <Select
                  name="custCompanyTypeSeq"
                  defaultValue={0}
                  style={{ height: '100%' }}
                  onChange={e => {
                    const custCompanyTypeSeq = Number(e.target.value) || undefined;
                    setFilter({ ...customerFilter, custCompanyTypeSeq });
                  }}
                >
                  <MenuItem value={0}>{t('pages.manage.customer.grid.all')}</MenuItem>
                  {minor.custCompanyType
                    .filter(({ seq }) => seq !== 1003001)
                    .map(({ seq, remark }) => (
                      <MenuItem key={seq} value={seq}>
                        {remark}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </HeaderCell>
          ) : null
      },
      {
        key: 'companyTypeSeq',
        name: t('pages.manage.customer.grid.companyType'),
        width: 200,
        renderCell: ({ row }) => {
          const handleClick = () =>
            setUpdateTypeDialog({ open: true, data: row, key: 'companyType', default: row.companyTypeSeq });

          return (
            <EditTypeCellWrapper>
              <span>{minor?.companyType.find(({ seq }) => seq === row.companyTypeSeq)?.remark || ''}</span>
              <div className="edit-btn">
                <Tooltip title={t('pages.manage.customer.tooltip.updateCompanyType')} placement="right">
                  <IconButton onClick={handleClick}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </EditTypeCellWrapper>
          );
        },
        renderHeaderCell: ({ ...props }: RenderHeaderCellProps<any>) =>
          minor ? (
            <HeaderCell {...props} filterEnabled={customerFilter.enabled}>
              <FormControl
                style={{ width: '100%', height: '30px' }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                <Select
                  name="companyTypeSeq"
                  defaultValue={0}
                  style={{ height: '100%' }}
                  onChange={e => {
                    const companyTypeSeq = Number(e.target.value) || undefined;
                    console.log(companyTypeSeq);
                    setFilter({ ...customerFilter, companyTypeSeq });
                  }}
                >
                  <MenuItem value={0}>{t('pages.manage.customer.grid.all')}</MenuItem>
                  {minor.companyType.map(({ seq, remark }) => (
                    <MenuItem key={seq} value={seq}>
                      {remark}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </HeaderCell>
          ) : null
      },
      {
        key: 'companyNo',
        name: t('pages.manage.customer.grid.companyNo'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.companyNo,
          onChange: e => {
            setFilter({ ...customerFilter, companyNo: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'ownerName',
        name: t('pages.manage.customer.grid.ownerName'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.ownerName,
          onChange: e => {
            setFilter({ ...customerFilter, ownerName: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'tel',
        name: t('pages.manage.customer.grid.tel'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.tel,
          onChange: e => {
            setFilter({ ...customerFilter, tel: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'email',
        name: t('pages.manage.customer.grid.email'),
        width: 200,
        renderEditCell: editCellRenderer,
        renderHeaderCell: ColumnSearchCell({
          enabled: customerFilter.enabled,
          value: customerFilter.email,
          onChange: e => {
            setFilter({ ...customerFilter, email: e.target.value });
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(refetch, 500);
          }
        })
      },
      {
        key: 'custStatusSeq',
        name: t('pages.manage.customer.grid.transaction status'),
        minWidth: 200,
        renderCell: ({ row }) => {
          const handleClick = () =>
            setUpdateTypeDialog({ open: true, data: row, key: 'custStatus', default: row.custStatusSeq });

          return (
            <EditTypeCellWrapper>
              <span>{minor?.custStatus.find(({ seq }) => seq === row.custStatusSeq)?.remark || ''}</span>
              <div className="edit-btn">
                <Tooltip title={t('pages.manage.customer.tooltip.updateCustomerStatus')} placement="right">
                  <IconButton onClick={handleClick}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </EditTypeCellWrapper>
          );
        },
        renderHeaderCell: ({ ...props }: RenderHeaderCellProps<any>) =>
          minor ? (
            <HeaderCell {...props} filterEnabled={customerFilter.enabled}>
              <FormControl
                style={{ width: '100%', height: '30px' }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              >
                <Select
                  name="custStatusSeq"
                  defaultValue={0}
                  style={{ height: '100%' }}
                  onChange={e => {
                    const custStatusSeq = Number(e.target.value) || undefined;
                    console.log(custStatusSeq);
                    setFilter({ ...customerFilter, custStatusSeq });
                  }}
                >
                  <MenuItem value={0}>{t('pages.manage.customer.grid.all')}</MenuItem>
                  {minor.custStatus.map(({ seq, remark }) => (
                    <MenuItem key={seq} value={seq}>
                      {remark}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </HeaderCell>
          ) : null
      },
      {
        key: 'more',
        name: '',
        width: 200,
        renderCell: ({ row }) => (
          <IconButton onClick={() => handleOpenDetailsDialog(row)}>
            <Button>{t('pages.manage.customer.tooltip.add')}</Button>
          </IconButton>
        )
      }
    ],
    [customerFilter, minor, setFilter, refetch, t]
  );

  useEffect(() => {
    refetch();
  }, [
    customerFilter.enabled,
    customerFilter.custCompanyTypeSeq,
    customerFilter.companyTypeSeq,
    customerFilter.custStatusSeq,
    refetch
  ]);

  return (
    <>
      <StyledDataGrid
        rowKeyGetter={row => row.seq}
        containerClassName="manage-grid-container"
        columns={columns}
        rows={data?.contents || []}
        selectedRows={selectedRows}
        sortColumns={sortColumns}
        filterEnabled={customerFilter.enabled}
        filterMenuBottom={
          <>
            <IconButton onClick={() => setNewCustomerDialog({ open: true, error: defaultNewCustomerDialogError })}>
              <Tooltip title={t('pages.manage.customer.tooltip.createCustomer')} placement="left">
                <AddIcon fontSize="small" style={{ fill: theme.palette.info.main }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={!selectedRows.size}
              onClick={() => setDeleteCustomerDialog(prev => ({ ...prev, open: true }))}
            >
              <Tooltip title={t('pages.manage.customer.tooltip.deleteCustomer')} placement="left">
                <DeleteIcon
                  fontSize="small"
                  style={{ fill: !selectedRows.size ? theme.palette.action.disabled : undefined }}
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
        onRowsChange={(rows, data) => {
          const idx = data.indexes[0];
          handleUpdateCustomer(rows[idx]);
        }}
        onFilterToggleBtnClick={() => setFilter({ ...customerFilter, enabled: !customerFilter.enabled })}
        onFilterResetBtnClick={() => {
          setFilter({ ...customerFilter, ...defaultCustomerFilterValue, enabled: customerFilter.enabled });
          setTimeout(refetch);
        }}
        onPageSizeOptionChange={e => setPagination({ ...pagination, page: 0, pageSize: Number(e.target.value) })}
        onPageChange={(e, page) => setPagination({ ...pagination, page: page - 1 })}
      />

      {/* =============== 고객 생성 start ================ */}
      {minor && (
        <Dialog
          component="form"
          open={newCustomerDialog.open}
          onSubmit={async e => {
            e.preventDefault();
            const $form = e.currentTarget as any as HTMLFormElement;
            const data: CustomerData = Object.fromEntries(new FormData($form));
            data.custCompanyTypeSeq = Number(data.custCompanyTypeSeq);
            data.companyTypeSeq = Number(data.companyTypeSeq);
            data.custStatusSeq = Number(data.custStatusSeq);
            console.log(data);

            if (
              !data.companyName ||
              !data.companyShortName ||
              !data.custCompanyTypeSeq ||
              !data.companyTypeSeq ||
              !data.companyNo ||
              !data.ownerName ||
              !data.custStatusSeq ||
              !data.tel ||
              !data.email
            ) {
              setNewCustomerDialog(prev => ({
                ...prev,
                error: {
                  companyName: !data.companyName,
                  companyShortName: !data.companyShortName,
                  custCompanyTypeSeq: !data.custCompanyTypeSeq,
                  companyTypeSeq: !data.companyTypeSeq,
                  companyNo: !data.companyNo,
                  ownerName: !data.ownerName,
                  custStatusSeq: !data.custStatusSeq,
                  tel: !data.tel,
                  email: !data.email
                }
              }));
              return;
            }

            const code = await createCustomer(data);
            switch (code) {
              case 'warn':
                toast(t('pages.manage.customer.toast.createCustomerFail'), { type: 'warning' });
                break;
              case 'error':
                toast(t('components.toast.error'), { type: 'error' });
                break;
              default:
                toast(t('pages.manage.customer.toast.createCustomerSuccess'), { type: 'success' });
            }
            setNewCustomerDialog(prev => ({ ...prev, open: false }));
            refetch();
          }}
        >
          <DialogTitle className="dialog-title">
            <AddIcon />
            <span>{t('pages.manage.customer.tooltip.createCustomer')}</span>
          </DialogTitle>
          <DialogContent
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', overflow: 'visible' }}
          >
            <TextField
              size="small"
              name="companyName"
              label={t('pages.manage.customer.grid.companyName')}
              error={newCustomerDialog.error.companyName}
              onChange={() => setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, companyName: false } }))}
            />
            <TextField
              size="small"
              name="companyShortName"
              label={t('pages.manage.customer.grid.companyShortName')}
              error={newCustomerDialog.error.companyShortName}
              onChange={() =>
                setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, companyShortName: false } }))
              }
            />
            <FormControl style={{ width: '100%' }}>
              <InputLabel size="small" id="cust-company-type-seq">
                {t('pages.manage.customer.grid.custCompanyType')}
              </InputLabel>
              <Select
                id="cust-company-type-seq"
                size="small"
                name="custCompanyTypeSeq"
                label={t('pages.manage.customer.grid.custCompanyType')}
                defaultValue={0}
                error={newCustomerDialog.error.custCompanyTypeSeq}
                onChange={() =>
                  setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, custCompanyTypeSeq: false } }))
                }
              >
                <MenuItem value={0}>-</MenuItem>
                {minor.custCompanyType
                  .filter(({ seq }) => seq !== 1003001)
                  .map(({ seq, remark }) => (
                    <MenuItem key={seq} value={seq}>
                      {remark}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: '100%' }}>
              <InputLabel size="small" id="company-type-seq">
                {t('pages.manage.customer.grid.companyType')}
              </InputLabel>
              <Select
                id="company-type-seq"
                size="small"
                name="companyTypeSeq"
                label={t('pages.manage.customer.grid.companyType')}
                defaultValue={0}
                error={newCustomerDialog.error.companyTypeSeq}
                onChange={() =>
                  setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, companyTypeSeq: false } }))
                }
              >
                <MenuItem value={0}>-</MenuItem>
                {minor.companyType.map(({ seq, remark }) => (
                  <MenuItem key={seq} value={seq}>
                    {remark}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              name="companyNo"
              label={t('pages.manage.customer.grid.companyNo')}
              error={newCustomerDialog.error.companyNo}
              onChange={() => setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, companyNo: false } }))}
            />
            <TextField
              size="small"
              name="ownerName"
              label={t('pages.manage.customer.grid.ownerName')}
              error={newCustomerDialog.error.ownerName}
              onChange={() => setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, ownerName: false } }))}
            />
            <FormControl style={{ width: '100%' }}>
              <InputLabel size="small" id="cust-status-seq">
                {t('pages.manage.customer.grid.transaction status')}
              </InputLabel>
              <Select
                id="cust-status-seq"
                size="small"
                name="custStatusSeq"
                label={t('pages.manage.customer.grid.transaction status')}
                defaultValue={0}
                error={newCustomerDialog.error.custStatusSeq}
                onChange={() =>
                  setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, custStatusSeq: false } }))
                }
              >
                <MenuItem value={0}>-</MenuItem>
                {minor.custStatus.map(({ seq, remark }) => (
                  <MenuItem key={seq} value={seq}>
                    {remark}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              name="tel"
              label={t('pages.manage.customer.grid.tel')}
              error={newCustomerDialog.error.tel}
              onChange={() => setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, tel: false } }))}
            />
            <TextField
              size="small"
              name="email"
              label={t('pages.manage.customer.grid.email')}
              error={newCustomerDialog.error.email}
              onChange={() => setNewCustomerDialog(prev => ({ ...prev, error: { ...prev.error, email: false } }))}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={e => setNewCustomerDialog(prev => ({ ...prev, open: false }))}>
              {t('components.dialog.close')}
            </Button>
            <Button type="submit">{t('components.dialog.confirm')}</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* =============== 고객 생성 end ================ */}
      

      {/* =============== 고객 삭제 start ================ */}
      <Dialog open={deleteCustomerDialog.open}>
        <DialogTitle className="dialog-title">
          <DeleteIcon />
          <span>{t('pages.manage.customer.dialog.deleteCustomerTitle')}</span>
        </DialogTitle>
        <DialogContent>
          {t('pages.manage.customer.dialog.deleteCustomerText', { replace: { n: selectedRows.size } })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCustomerDialog(prev => ({ ...prev, open: false }))}>
            {t('components.dialog.cancel')}
          </Button>
          <Button
            onClick={async () => {
              try {
                if (!selectedRows.size) return;
                await deleteCustomer(Array.from(selectedRows));
                toast(t('pages.manage.customer.toast.deleteCustomerSuccess'), { type: 'success' });
              } catch (err) {
                console.error(err);
                toast(t('pages.manage.customer.toast.deleteCustomerError'), { type: 'error' });
              }
              setPagination(prev => ({ ...prev, page: 0 }));
              setDeleteCustomerDialog(prev => ({ ...prev, open: false }));
              setSelectedRows(new Set());
              refetch();
            }}
          >
            {t('components.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* =============== 고객 삭제 end ================ */}

      {/* =============== 고객 업데이트 start ================ */}
      {minor && updateTypeDialog.data && (
        <Dialog
          open={updateTypeDialog.open}
          component="form"
          onSubmit={e => {
            e.preventDefault();
            if (!updateTypeDialog.key) return;
            const $form = e.currentTarget as any as HTMLFormElement;
            const { value } = $form[updateTypeDialog.key];
            handleUpdateCustomer({ ...updateTypeDialog.data, [`${updateTypeDialog.key}Seq`]: value });
            setUpdateTypeDialog(prev => ({ ...prev, open: false }));
          }}
        >
          <DialogTitle className="dialog-title">
            <EditIcon />
            {updateTypeDialog.key === 'custCompanyType' && (
              <span>{t('pages.manage.customer.tooltip.updateCustomerCompanyType')}</span>
            )}
            {updateTypeDialog.key === 'companyType' && (
              <span>{t('pages.manage.customer.tooltip.updateCompanyType')}</span>
            )}
            {updateTypeDialog.key === 'custStatus' && (
              <span>{t('pages.manage.customer.tooltip.updateCustomerStatus')}</span>
            )}
          </DialogTitle>
          <DialogContent style={{ overflowY: 'visible' }}>
            {updateTypeDialog.key && (
              <FormControl style={{ width: '100%' }}>
                <InputLabel size="small" id="update-type-select-label">
                  {t(`pages.manage.customer.grid.${updateTypeDialog.key}`)}
                </InputLabel>
                <Select
                  id="update-type-select-label"
                  size="small"
                  name={updateTypeDialog.key}
                  label={t(`pages.manage.customer.grid.${updateTypeDialog.key}`)}
                  defaultValue={updateTypeDialog.default}
                >
                  {minor[updateTypeDialog.key]
                    .filter(({ seq }) => seq !== 1003001)
                    .map(({ seq, remark }) => (
                      <MenuItem key={seq} value={seq}>
                        {remark}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setUpdateTypeDialog(prev => ({ ...prev, open: false }))}>
              {t('components.dialog.cancel')}
            </Button>
            <Button type="submit">{t('components.dialog.confirm')}</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* =============== 고객 업데이트 end ================ */}

      {/* =============== 추가 데이터 모달창 start =============== */}
      <Dialog open={detailDialog.open} onClose={handleCloseDetailsDialog}>
        <DialogTitle>{t('components.dialog.Institution information registration')}</DialogTitle>
        <DialogContent>
          {detailDialog.data && Object.keys(detailDialog.data)
          .filter((_, index) => ![0,3,4,5,6,11,12,13,19,20].includes(index))
          .map((key) => (
            <TextField
              key={key}
              label={t(`pages.manage.customer.grid.${key}`)}
              value={detailDialog.data?.[key] || ''}
              onChange={(e) => handleDetailChange(key as keyof CustomerData, e.target.value)}
              fullWidth
              margin="normal"
              disabled={key === 'companyShortName'}
            />
          ))}
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('pages.manage.customer.grid.domestic/overseas')}</InputLabel>
            <Select
              value={detailDialog.data?.domForSeq || ''}
              onChange={(e) => handleDetailChange('domForSeq', e.target.value)}
              label={t('pages.manage.customer.grid.domestic/overseas')}
            >
              {domForOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('pages.manage.customer.grid.country')}</InputLabel>
            <Select
              value={detailDialog.data?.countrySeq || ''}
              onChange={(e) => handleDetailChange('countrySeq', e.target.value)}
              label={t('pages.manage.customer.grid.country')}
            >
              {countryNameOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('pages.manage.customer.grid.custCompanyType')}</InputLabel>
            <Select
              value={detailDialog.data?.custCompanyTypeSeq || ''}
              onChange={(e) => handleDetailChange('custCompanyTypeSeq', e.target.value)}
              label={t('pages.manage.customer.grid.custCompanyType')}
            >
              {custCompanyTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('pages.manage.customer.grid.companyType')}</InputLabel>
            <Select
              value={detailDialog.data?.companyTypeSeq || ''}
              onChange={(e) => handleDetailChange('companyTypeSeq', e.target.value)}
              label={t('pages.manage.customer.grid.companyType')}
            >
              {companyTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('pages.manage.customer.grid.transaction status')}</InputLabel>
            <Select
              value={detailDialog.data?.custStatusSeq || ''}
              onChange={(e) => handleDetailChange('custStatusSeq', e.target.value)}
              label={t('pages.manage.customer.grid.transaction status')}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>{t('components.dialog.close')}</Button>
          <Button onClick={handleSaveDetails}>{t('components.grid.save')}</Button>
        </DialogActions>
      </Dialog>
      {/* =============== 추가 데이터 모달창 end =============== */}
    </>
  );
};

export default CustomerPage;
