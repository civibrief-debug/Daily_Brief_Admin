import HomepagePlacementBuilder from '../../components/HomepagePlacementBuilder';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomepageArticlePlacementPage() {
  return <HomepagePlacementBuilder />;
}
