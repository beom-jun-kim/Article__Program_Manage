'use client';
import React from 'react';
import { CircularProgress, Typography, useTheme } from '@mui/material';
import { useTranslation } from '@/i18n/client';
import useUsageData from '@/app/manage/usage/useUsageData';

const UsagePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isFetching, isError } = useUsageData();

  if (isFetching) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!data || isError) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography style={{ color: theme.palette.error.main }}>{t('components.grid.error')}</Typography>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Typography variant="h4">{data.companyName}</Typography>
      <table>
        <colgroup>
          <col width="250px" />
          <col width="400px" />
          <col width="250px" />
          <col width="400px" />
        </colgroup>
        <tbody>
          <tr>
            <th>
              <Typography>{t('pages.manage.usage.table.companyRegistrationNumber')}</Typography>
            </th>
            <td>
              <Typography>{data.companyNo || t('pages.manage.usage.table.noData')}</Typography>
            </td>
            <th>
              <Typography>{t('pages.manage.usage.table.tel')}</Typography>
            </th>
            <td>
              <Typography>{data.tel || t('pages.manage.usage.table.noData')}</Typography>
            </td>
          </tr>
          <tr>
            <th>
              <Typography>{t('pages.manage.usage.table.owner')}</Typography>
            </th>
            <td>
              <Typography>{data.owner || t('pages.manage.usage.table.noData')}</Typography>
            </td>
            <th>
              <Typography>{t('pages.manage.usage.table.email')}</Typography>
            </th>
            <td>
              <Typography>{data.email || t('pages.manage.usage.table.noData')}</Typography>
            </td>
          </tr>
          <tr>
            <th>
              <Typography>{t('pages.manage.usage.table.accountNum')}</Typography>
            </th>
            <td>
              <Typography>{data.empCount || t('pages.manage.usage.table.noData')}</Typography>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <Typography variant="h6">{t('pages.manage.usage.serviceUsage')}</Typography>
      <table>
        <colgroup>
          <col width="250px" />
          <col width="400px" />
        </colgroup>
        <tbody>
          {/* <tr>
            <th>
              <div>
                <Typography>1. {`"${t('pages.manage.usage.table.articleCreation')}"`}</Typography>
              </div>
            </th>
          </tr>
          <tr>
            <th>
              <div>
                <Typography>2. {`"${t('pages.manage.usage.table.findAttachedMaterials')}"`}</Typography>
              </div>
            </th>
          </tr>
          <tr>
            <th>
              <div>
                <Typography>3. {`"${t('pages.manage.usage.table.summarize')}"`}</Typography>
              </div>
            </th>
          </tr> */}
          {data.prices.map(({ serviceCode, serviceName, usedCount }, i) => (
            <tr key={serviceCode}>
              <th>
                <Typography>{`${i + 1}. "${serviceName}"`}</Typography>
              </th>
              <td>
                <Typography>{usedCount}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      {data.prices[0]?.date && data.prices[0]?.usedPrice && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
            <Typography variant="h6">
              {t('pages.manage.usage.expectedPaymentAmount', {
                replace: { m: new Date(data.prices[0].date).getMonth() + 1 }
              })}
            </Typography>
            <Typography
              variant="body2"
              style={{ marginBottom: '4px' }}
            >{`(${t('pages.manage.usage.VATIncluded')})`}</Typography>
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <Typography variant="h4">
                    {`${data.prices[0].currUnit} ${data.prices[0].totalPrice?.toLocaleString()}`.trim()}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UsagePage;
