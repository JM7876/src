import Link from "next/link";
import { Collection } from "@/lib/types";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <article className="card">
      <h3>{collection.name}</h3>
      <p>{collection.description}</p>
      <Link className="btn" href={`/collections/${collection.slug}`}>Browse Collection</Link>
    </article>
  );
}
