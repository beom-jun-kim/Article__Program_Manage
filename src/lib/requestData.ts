import { NextRequest } from 'next/server';

const requestData = async (req: NextRequest) => {
  const qs = Object.fromEntries(req.nextUrl.searchParams);
  const json = await (async () => {
    try {
      return await req.json();
    } catch {
      return {};
    }
  })();
  const formData = await (async () => {
    try {
      return await req.formData();
    } catch {
      return new FormData();
    }
  })();
  return { qs, json, formData };
};

export default requestData;
