import React from 'react';
import { useTranslation } from '@/i18n/client';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { type RenderEditCellProps, type RenderHeaderCellProps } from 'react-data-grid';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const HeaderCell = ({
  filterEnabled,
  children,
  ...props
}: RenderHeaderCellProps<any> & { filterEnabled?: boolean; children?: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} tabIndex={props.tabIndex}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          lineHeight: filterEnabled && children ? '40px' : undefined
        }}
      >
        <div>{props.column.name}</div>
        {props.column.sortable && /asc/i.test(props.sortDirection || '') && (
          <ArrowUpwardIcon style={{ width: '18px', height: '18px' }} />
        )}
        {props.column.sortable && /desc/i.test(props.sortDirection || '') && (
          <ArrowDownwardIcon style={{ width: '18px', height: '18px' }} />
        )}
      </div>
      {filterEnabled && children}
    </div>
  );
};

export const ColumnSearchCell =
  ({
    enabled = false,
    value,
    onChange
  }: {
    enabled?: boolean;
    value: any;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  }) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: RenderHeaderCellProps<any>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslation();

    return (
      <HeaderCell {...props} filterEnabled={enabled}>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('components.grid.search')}
          value={value}
          style={{ padding: 0 }}
          InputProps={{ style: { margin: 0, fontSize: '14px' } }}
          inputProps={{ style: { padding: '5px', fontSize: '14px' } }}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
          onChange={onChange}
        />
      </HeaderCell>
    );
  };

const EditCellForm = ({ row, column, onRowChange, onClose }: RenderEditCellProps<any>) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        onRowChange({ ...row, [column.key]: e.currentTarget.editor.value }, true);
        onClose(true, false);
      }}
      onKeyDown={e => e.key === 'Enter' && e.stopPropagation()}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '0 10px',
        gap: '5px'
      }}
    >
      <TextField
        name="editor"
        variant="standard"
        size="small"
        defaultValue={row[column.key as 'seq' | 'uuid']}
        style={{ width: '100%' }}
        InputProps={{ style: { fontSize: 'unset' } }}
        autoFocus
      />
      <Tooltip title={t('components.grid.save')}>
        <IconButton type="submit" size="small" onClick={e => e.stopPropagation()}>
          <SaveAsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('components.grid.close')}>
        <IconButton type="button" size="small" onClick={() => onClose(false, false)}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </form>
  );
};

export function editCellRenderer<T = any>(props: RenderEditCellProps<T>) {
  return <EditCellForm {...props} />;
}
