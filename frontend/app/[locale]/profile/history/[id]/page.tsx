import Client from './Client';

export default async function Page({ params, searchParams }: { params: Promise<any>, searchParams?: Promise<any> }) {
  return <Client params={params} searchParams={searchParams} />;
}