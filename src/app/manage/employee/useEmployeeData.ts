import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SortColumn } from 'react-data-grid';
import axios, { AxiosError } from 'axios';
import { type TreeViewBaseItem } from '@mui/x-tree-view/models';
import { languages } from '@/i18n/settings';
import { EmployeeFilter } from '@/app/manage/employee/contexts';

interface UseEmployeeDataProps {
  lng: (typeof languages)[number];
  pagination: PaginationInfo;
  sortColumns: SortColumn[];
  filter: EmployeeFilter;
}

export interface EmployeeData {
  seq?: string;
  empName?: string;
  empNameEn?: string;
  empId?: string;
  email?: string;
  phone?: string;
  admin?: boolean;
  genderSeq?: 1002001 | 1002002;
  gender?: string;
  birth?: Date;
  deptSeq?: number;
  dept?: string;
  deptEn?: string;
  countrySeq?: number;
  country?: string;
  countryEn?: string;
}

export interface OrganizationData {
  deptSeq: number;
  deptName: string;
  deptLevel: number;
  companyName: string;
}

const useEmployeeData = ({ lng, pagination, sortColumns, filter: employeeFilter }: UseEmployeeDataProps) => {
  const { data, isFetching, isRefetching, isError, isRefetchError, refetch } = useQuery({
    queryKey: ['employee', lng, pagination, sortColumns],
    queryFn: () => {
      const { page, pageSize } = pagination;
      const { enabled, ...filter } = employeeFilter;
      return axios
        .get<PaginationType<EmployeeData>>('/manage/api/v1/employee', {
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

  const { data: organizationsTreeData } = useQuery({
    queryKey: ['organizations'],
    initialData: [],
    queryFn: async () => {
      const { companyName } = await axios.get<CompanyData>('/manage/api/v1/company').then(({ data }) => data);
      return await axios
        .get<OrganizationData[]>('/manage/api/v1/employee/organizations')
        .then(({ data }): TreeViewBaseItem[] => [
          {
            id: 'root',
            label: companyName || 'Root',
            children: data.map(d => ({ id: `${d.deptSeq}`, label: d.deptName }))
          }
        ]);
    }
  });

  const status = useMemo((): FetchStatus => {
    if (isFetching || isRefetching) return 'fetching';
    if (isError || isRefetchError) return 'error';
    return 'success';
  }, [isFetching, isRefetching, isError, isRefetchError]);

  const updateEmployee = async (data: Partial<EmployeeData>) => {
    try {
      await axios.put('/manage/api/v1/employee', data, {
        headers: { 'Content-Type': 'application/json' }
      });
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

  const deleteEmployee = async (seqArr: string[]) => {
    await axios.delete('/manage/api/v1/employee', {
      params: { seq: seqArr }
    });
  };

  return { data, status, organizationsTreeData, refetch, updateEmployee, deleteEmployee };
};

export default useEmployeeData;
