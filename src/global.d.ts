declare global {
  interface PaginationType<T = any> {
    total: number;
    page: number;
    pageSize: number;
    contents: T[];
  }

  interface PaginationInfo {
    page: number;
    pageSize: number;
    pageSizeOptions: number[];
  }

  type FetchStatus = 'fetching' | 'success' | 'error';

  /**
   * @description
   * - G : 전체 페이지 표시
   * - A : 고객사 정보, 고객사 별 담당자 정보 제외 나머지 페이지만 표시
   * - N : Manage 탭 및 페이지 표시 X
   */
  type UserPositionType = 'G' | 'A' | 'N';

  interface UserInfo {
    userId: string;
    companySeq: number;
    userPosType: UserPositionType;
  }

  interface CompanyData {
    companyNo?: string;
    companyName?: string;
    owner?: string;
    tel?: string;
    email?: string;
    empCount?: number;
  }
}

export {};
