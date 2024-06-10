import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SortColumn } from 'react-data-grid';
import axios, { AxiosError } from 'axios';
import { languages } from '@/i18n/settings';
import { CustomerFilter } from '@/app/manage/customer/contexts';

interface UseRepresentativeDataProps {
  lng: (typeof languages)[number];
  pagination: PaginationInfo;
  sortColumns: SortColumn[];
  filter: CustomerFilter;
}

export interface RepresentativeData {
  companySeq?: number;
  companyName?: string;
  custEmpName?: string;
  custEmpTel?: string;
  custEmpFax?: string;
  custEmpEmail?: string;
  custEmpPosition?: string;
}

const useRepresentativeData = ({
  lng,
  pagination,
  filter: customerFilter,
  sortColumns
}: UseRepresentativeDataProps) => {
  const { data, isFetching, isRefetching, isError, isRefetchError, refetch } = useQuery({
    queryKey: ['representative', lng, pagination, sortColumns],
    queryFn: () => {
      const { page, pageSize } = pagination;
      const { enabled, ...filter } = customerFilter;

      return axios
        .get<PaginationType<RepresentativeData>>('/manage/api/v1/representative', {
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

  const status = useMemo((): FetchStatus => {
    if (isFetching || isRefetching) return 'fetching';
    if (isError || isRefetchError) return 'error';
    return 'success';
  }, [isFetching, isRefetching, isError, isRefetchError]);

  const updateRepresentative = async (representative: RepresentativeData) => {
    try {
      const { companyName, ...data } = representative;

      await axios.put('/manage/api/v1/representative', data, {
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

  return { data, status, refetch, updateRepresentative };
};

export default useRepresentativeData;
