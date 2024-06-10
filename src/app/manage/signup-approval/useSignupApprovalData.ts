import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SortColumn } from 'react-data-grid';
import axios, { AxiosError } from 'axios';
import { languages } from '@/i18n/settings';
import { SignupApprovalFilter } from '@/app/manage/signup-approval/contexts';

interface UseSignupApprovalDataProps {
  lng: (typeof languages)[number];
  pagination: PaginationInfo;
  sortColumns: SortColumn[];
  filter: SignupApprovalFilter;
}

export interface SignupApprovalData {
  seq?: string;
  username?: string;
  usernameEn?: string;
  email?: string;
  phone?: string;
  genderSeq?: 1002001 | 1002002;
  gender?: string;
  birth?: Date;
  country?: string;
  countryEn?: string;
  createDate?: Date;
}

const useSignupApprovalData = ({
  lng,
  pagination,
  sortColumns,
  filter: signupApprovalFilter
}: UseSignupApprovalDataProps) => {
  const { data, isFetching, isRefetching, isError, isRefetchError, refetch } = useQuery({
    queryKey: ['signupApproval', lng, pagination, sortColumns],
    queryFn: () => {
      const { page, pageSize } = pagination;
      const { enabled, ...filter } = signupApprovalFilter;
      return axios
        .get<PaginationType<SignupApprovalData>>('/manage/api/v1/signup-approval', {
          params: {
            page,
            pageSize,
            filter: enabled ? filter : undefined,
            sort: sortColumns
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

  const updateUser = async (seqArr: string[], approval: boolean) => {
    try {
      await axios.put(
        '/manage/api/v1/signup-approval',
        { seq: seqArr, approval },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return 'success';
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status && Math.floor(err.response.status / 100) === 4) {
        console.warn(err);
        return 'warn';
      }
      console.error(err);
      return 'error';
    }
  };

  return { data, status, refetch, updateUser };
};

export default useSignupApprovalData;
