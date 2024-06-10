import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface PriceData {
  date?: Date;
  serviceCode?: number;
  serviceName?: string;
  usedCount?: number;
  currUnit?: string;
  usedPrice?: number;
  totalPrice?: number;
}

type UsageData = CompanyData & { prices: PriceData[] };

const useUsageData = () => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const company = await axios.get<CompanyData>('/manage/api/v1/company').then(({ data }) => data);
      const prices = await axios.get<PriceData[]>('/manage/api/v1/usage').then(({ data }) => data);
      const result: UsageData = { ...company, prices };
      return result;
    }
  });

  return {
    data,
    isFetching,
    isError
  };
};

export default useUsageData;
