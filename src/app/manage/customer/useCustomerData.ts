import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SortColumn } from 'react-data-grid';
import axios, { AxiosError } from 'axios';
import { languages } from '@/i18n/settings';
import { CustomerFilter } from '@/app/manage/customer/contexts';

interface UseCustomerDataProps {
  lng: (typeof languages)[number];
  pagination: PaginationInfo;
  sortColumns: SortColumn[];
  filter: CustomerFilter;
}

export interface CustomerData {
  seq?: number;
  companyName?: string;
  companyShortName?: string;
  custCompanyTypeSeq?: number;
  custCompanyType?: string;
  companyTypeSeq?: number;
  companyType?: string;
  companyNo?: string;
  ownerName?: string;
  tel?: string;
  email?: string;
  custStatusSeq?: number;
  [key: string]: any;

  // 더보기 데이터
  // foundingDate?: string;
  // faxNumber?: string;
  // website?: string;
  // representativePosition?: string;
  // domesticOrForeign?: string;
  // country?: string;
  // koreanAddress?: string;
  // englishAddress?: string;
  // postalCode?: string;
  // transactionStartDate?: string;
  // transactionEndDate?: string;
}

export interface CustomerMinorData {
  custCompanyType: { seq: number; remark: string }[];
  companyType: { seq: number; remark: string }[];
  custStatus: { seq: number; remark: string }[];
}

const useCustomerData = ({ lng, pagination, filter: customerFilter, sortColumns }: UseCustomerDataProps) => {
  const { data, isFetching, isRefetching, isError, isRefetchError, refetch } = useQuery({
    queryKey: ['customer', lng, pagination, sortColumns],
    queryFn: () => {
      const { page, pageSize } = pagination;
      const { enabled, ...filter } = customerFilter;

      return axios
        .get<PaginationType<CustomerData>>('/manage/api/v1/customer', {
          params: {
            page,
            pageSize,
            sort: sortColumns,
            filter: enabled ? filter : undefined
          }
        })
        .then(({ data }) => data);
    }
  });

  const minorQuery = useQuery({
    queryKey: ['customer', 'minor'],
    queryFn: () => axios.get<CustomerMinorData>('/manage/api/v1/customer/minor').then(({ data }) => data)
  });

  const status = useMemo((): FetchStatus => {
    if (isFetching || isRefetching || minorQuery.isFetching) return 'fetching';
    if (isError || isRefetchError || minorQuery.isError) return 'error';
    return 'success';
  }, [isFetching, isRefetching, isError, isRefetchError, minorQuery.isFetching, minorQuery.isError]);

  const createCustomer = async (customer: CustomerData) => {
    try {
      const { seq, custCompanyType, companyType, ...data } = customer;
      await axios.post('/manage/api/v1/customer', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      return 'success';
    } catch (err) {
      if (err instanceof AxiosError && err.response && Math.floor(err.response.status / 100) === 4) {
        console.warn(err);
        return 'warn';
      }
      console.error(err);
      return 'error';
    }
  };

  const updateCustomer = async (customer: CustomerData) => {
    try {
      const { custCompanyType, companyType, ...data } = customer;

      await axios.put('/manage/api/v1/customer', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      return 'success';
    } catch (err) {
      if (err instanceof AxiosError && err.response && Math.floor(err.response.status / 100) === 4) {
        console.warn(err);
        return 'warn';
      }
      console.error(err);
      return 'error';
    }
  };

  const deleteCustomer = async (seqArr: string[]) => {
    await axios.delete('/manage/api/v1/customer', {
      params: { seq: seqArr }
    });
  };
  console.log("xxxxxxxxxxxxxxdataxxxxxxxxxxxxx",data);
  return { data, status, refetch, minor: minorQuery.data, createCustomer, deleteCustomer, updateCustomer };
};

export default useCustomerData;
