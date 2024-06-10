import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const useUser = () => {
  const { data: userInfo, isError } = useQuery({
    queryKey: ['userinfo'],
    retry: (_, err) => {
      if (process.env.NODE_ENV === 'production' && err instanceof AxiosError && err.response?.status === 401) {
        window.location.href = '/';
        return false;
      }
      return true;
    },
    queryFn: () => axios.get<UserInfo>('/manage/api/v1/userinfo').then(({ data }) => data)
  });

  return {
    userInfo,
    isError
  };
};

export default useUser;
