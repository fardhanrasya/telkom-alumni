"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ContributorsSkeleton from "@/components/ContributorsSkeleton";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

const Contributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch("/api/contributors");
        if (!response.ok) {
          throw new Error("Failed to fetch contributors");
        }
        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return <ContributorsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kontributor Proyek
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-red-600">
              Gagal memuat data kontributor: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kontributor Proyek
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Para developer yang berkontribusi dalam pengembangan Portal Alumni
            SMK Telkom Jakarta.
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="text-center group">
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full transition-transform group-hover:scale-105 relative">
                  <Image
                    src={contributor.avatar_url}
                    alt={`${contributor.login} avatar`}
                    fill
                    className="object-cover"
                    sizes="128px"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {contributor.login}
                </h3>
                <p className="text-primary font-medium">Contributor</p>
                <p className="mt-2 text-sm text-gray-600">
                  {contributor.contributions} kontribusi
                </p>
              </a>
            </div>
          ))}
        </div>

        {contributors.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              Belum ada kontributor yang ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contributors;
