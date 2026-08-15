import Client from './Client';

export default async function Page({ params }: { params: Promise<{locale: string}> }) {
  return (
    <>
      <Client />
    </>
  );
}
