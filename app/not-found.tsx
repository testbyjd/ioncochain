import Link from "next/link";
import { Orbit, ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main" className="min-h-svh grid place-items-center px-6">
      <div className="max-w-lg text-center">
        <Orbit size={50} className="mx-auto accent-text mb-7" />
        <div className="eyebrow">404 · OFF THE NETWORK</div>
        <h1 className="text-4xl leading-tight tracking-tight mt-5">
          A little outside the orbit.
        </h1>
        <p className="muted mt-5 leading-8">
          This page doesn’t exist. Let’s get you back to IONCO.
        </p>
        <Link className="btn-primary mt-8" href="/">
          Back to IONCO <ArrowUpRight />
        </Link>
      </div>
    </main>
  );
}
