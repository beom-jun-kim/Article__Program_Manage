import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { languages } from '@/i18n/settings';
import { DepartmentFilter } from '@/app/manage/department/contexts';

interface UseDepartmentDataProps {
  lng: (typeof languages)[number];
  pagination: PaginationInfo;
  filter: DepartmentFilter;
}

export interface DepartmentData {
  seq?: string;
  deptLevel?: number;
  deptName?: string;
  deptNameEn?: string;
  deptPhone?: string;
  deptFax?: string;
}

const useDepartmentData = ({ lng, pagination, filter: departmentFilter }: UseDepartmentDataProps) => {
  const { data, isFetching, isRefetching, isError, isRefetchError, refetch } = useQuery({
    queryKey: ['department', lng, pagination],
    queryFn: () => {
      const { page, pageSize } = pagination;
      const { enabled, ...filter } = departmentFilter;

      return axios
        .get<PaginationType<DepartmentData>>('/manage/api/v1/department', {
          params: {
            page,
            pageSize,
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

  const createDepartment = async (department: DepartmentData) => {
    try {
      const { seq, deptLevel, ...data } = department;
      await axios.post('/manage/api/v1/department', data, {
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

  const checkEmployeeExists = async (seqArr: string[]) => {
    try {
      await axios.get('/manage/api/v1/department/employee/exists', {
        params: { seq: seqArr }
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

  const deleteDepartment = async (seqArr: string[]) => {
    try {
      await axios.delete('/manage/api/v1/department', {
        params: { seq: seqArr }
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

  const updateDepartment = async (data: DepartmentData) => {
    try {
      await axios.put('/manage/api/v1/department', data, {
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

  return { data, status, refetch, createDepartment, checkEmployeeExists, updateDepartment, deleteDepartment };
};

export default useDepartmentData;
