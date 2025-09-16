"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft,
  Mail,
  Globe,
  MapPin,
  Award,
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Types from your original file
interface SocialMedia {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

interface Achievement {
  title: string;
  year: number;
  description?: string;
}

interface AlumniDetail {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  yearGraduated: number;
  major: string;
  profileImageUrl?: string;
  email?: string;
  socialMedia?: SocialMedia;
  currentJob?: {
    title?: string;
    company?: string;
    location?: string;
    startYear?: number;
  };
  bio?: any; // Can be string or PortableText
  achievements?: Achievement[];
}

interface Props {
  alumni: AlumniDetail;
}

// Helper function from your original file
function getMajorLabel(majorValue: string): string {
  const majorLabels: { [key: string]: string } = {
    rpl: "Rekayasa Perangkat Lunak",
    tkj: "Teknik Komputer dan Jaringan",
    mm: "Multimedia",
    tei: "Teknik Elektronika Industri",
  };
  return majorLabels[majorValue] || majorValue;
}

export default function AlumniDetailContent({ alumni }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-3">
        {/* Left column - Profile photo & contact info */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Profile photo */}
            <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-100">
              {alumni.profileImageUrl ? (
                <div className="aspect-[3/4] relative w-full">
                  <Image
                    src={alumni.profileImageUrl}
                    alt={alumni.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] flex w-full items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <span className="text-6xl font-bold text-primary-600">
                    {alumni.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Contact and social media info */}
            <div className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100">
              {alumni.email && (
                <div className="group flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <a
                    href={`mailto:${alumni.email}`}
                    className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {alumni.email}
                  </a>
                </div>
              )}

              {/* Social Media */}
              {alumni.socialMedia && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-base font-semibold text-gray-800">
                    Media Sosial
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {alumni.socialMedia.linkedin && (
                      <a
                        href={alumni.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-primary-50 hover:text-primary-700 hover:shadow-md"
                      >
                        <Linkedin className="h-5 w-5 text-[#0077B5]" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {alumni.socialMedia.instagram && (
                      <a
                        href={alumni.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-primary-50 hover:text-primary-700 hover:shadow-md"
                      >
                        <Instagram className="h-5 w-5 text-[#E4405F]" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {alumni.socialMedia.twitter && (
                      <a
                        href={alumni.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-primary-50 hover:text-primary-700 hover:shadow-md"
                      >
                        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Main information */}
        <div className="md:col-span-2">
          {/* Header with back navigation */}
          <div className="mb-6 flex items-center">
            <Link href="/alumni" className="mr-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary-50 hover:text-primary-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {alumni.name}
            </h2>
          </div>

          {/* Main info */}
          <div className="mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                {getMajorLabel(alumni.major)}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                <Award className="h-4 w-4 text-gray-500" />
                Lulus {alumni.yearGraduated}
              </span>
            </div>

            {alumni.currentJob && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">
                    {alumni.currentJob.title}
                    {alumni.currentJob.company && (
                      <>
                        <span className="mx-1 text-gray-400">di</span>
                        <span className="font-semibold text-primary-700">
                          {alumni.currentJob.company}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {alumni.currentJob.location && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {alumni.currentJob.location}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Biography */}
          {alumni.bio && (
            <div className="mb-10">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <div className="h-6 w-1 rounded-full bg-primary-500"></div>
                Biografi
              </h3>
              <div className="prose prose-gray max-w-none rounded-xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                <div className="leading-relaxed text-gray-700">
                  {typeof alumni.bio === "string" ? (
                    <p className="whitespace-pre-line">{alumni.bio}</p>
                  ) : (
                    <PortableText value={alumni.bio} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          {alumni.achievements && alumni.achievements.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <div className="h-6 w-1 rounded-full bg-primary-500"></div>
                Prestasi
              </h3>
              <div className="space-y-4">
                {alumni.achievements.map(
                  (achievement: Achievement, index: number) => (
                    <div
                      key={index}
                      className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {achievement.title}
                            </h4>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              {achievement.year}
                            </span>
                          </div>
                          {achievement.description && (
                            <div className="mt-2 text-sm text-gray-600">
                              {typeof achievement.description === "string" ? (
                                <p>{achievement.description}</p>
                              ) : (
                                <PortableText value={achievement.description} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12 flex justify-center">
            <Link href="/alumni">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full px-6 py-5 text-base shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Kembali ke Daftar Alumni</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
