import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { getJobBySlugQuery } from '@/sanity/queries/jobQueries';
import { PortableText } from '@portabletext/react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { urlFor } from '@/sanity/utils';
import Link from 'next/link';

// Simple SVGs for icons to prevent dependency resolution issues during build,
// or we can import from react-icons/fi. Let's use clean SVG icons for bulletproof compile.
const IconArrowLeft = () => (
  <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IconBriefcase = () => (
  <svg className="mr-2.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconMapPin = () => (
  <svg className="mr-2.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconDollarSign = () => (
  <svg className="mr-2.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="mr-2.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
  </svg>
);

const IconBookOpen = () => (
  <svg className="mr-2.5 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconExternalLink = () => (
  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface JobDetail {
  _id: string;
  title: string;
  slug: { current: string };
  company: string | { name: string; logo?: any };
  publishedAt: string;
  expiresAt?: string;
  jobType: string;
  workplaceType: string;
  salaryRange?: { min?: number; max?: number; currency?: string; isPublic?: boolean };
  description: any;
  requirements?: any;
  responsibilities?: any;
  applyLink?: string;
  contactEmail?: string;
  education_level?: string;
  education_is_mandatory?: boolean;
  min_experience_years?: number;
  experience_is_mandatory?: boolean;
  fresh_graduate_friendly?: boolean;
  postedBy?: {
    _id: string;
    name: string;
    profileImageUrl?: string;
  };
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await getJobDetail(resolvedParams.slug);
  
  if (!job) {
    return {
      title: 'Lowongan Tidak Ditemukan',
      description: 'Lowongan yang Anda cari tidak ditemukan atau sudah tidak tersedia.',
    };
  }
  
  const companyName = typeof job.company === 'string' ? job.company : job.company.name;
  return {
    title: `${job.title} di ${companyName} | Karir Alumni Telkom`,
    description: `Lowongan kerja ${job.title} di ${companyName}. ${job.jobType}, ${job.workplaceType}.`,
  };
}

async function getJobDetail(slug: string): Promise<JobDetail | null> {
  const isHexId = /^[0-9a-fA-F]{24}$/.test(slug);
  
  if (!isHexId) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fardhanserver.tail824e9e.ts.net';
  const apiKey = process.env.KARIR_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key is not configured on the server.');
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  
  try {
    const response = await fetch(`${apiUrl}/jobs/${slug}`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`External API responded with status ${response.status}`);
    }
    
    const jobData = await response.json();
    
    // Determine workplace type from requirements
    const reqLower = (jobData.raw_requirements || '').toLowerCase();
    let workplaceType = 'On-site';
    if (reqLower.includes('hybrid')) {
      workplaceType = 'Hybrid';
    } else if (reqLower.includes('remote') || reqLower.includes('kerja di rumah') || reqLower.includes('wfh')) {
      workplaceType = 'Remote';
    }
    
    // Map back to expected structure
    return {
      _id: jobData.id,
      title: jobData.title,
      slug: { current: jobData.id },
      company: jobData.company || '', // string
      location: jobData.location || '', // mapping location field
      publishedAt: jobData.posted_at ? new Date(jobData.posted_at * 1000).toISOString() : new Date().toISOString(),
      jobType: jobData.job_type === 'full-time' ? 'Full-time' : jobData.job_type === 'internship' ? 'Internship' : jobData.job_type === 'part-time' ? 'Part-time' : jobData.job_type === 'contract' ? 'Contract' : jobData.job_type === 'freelance' ? 'Freelance' : jobData.job_type,
      workplaceType: workplaceType,
      salaryRange: {
        min: jobData.salary_min,
        max: jobData.salary_max,
        currency: 'IDR',
        isPublic: !!(jobData.salary_min || jobData.salary_max)
      },
      description: jobData.description_summary || '',
      requirements: jobData.raw_requirements || '',
      applyLink: jobData.source_url || '',
      education_level: jobData.education_level,
      education_is_mandatory: jobData.education_is_mandatory,
      min_experience_years: jobData.min_experience_years,
      experience_is_mandatory: jobData.experience_is_mandatory,
      fresh_graduate_friendly: jobData.fresh_graduate_friendly,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error fetching job from external API:', error);
    throw error;
  }
}

function formatIDRCurrency(amount?: number): string {
  if (!amount) return 'N/A';
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    return `Rp ${millions.toFixed(millions % 1 === 0 ? 0 : 1)} Juta`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default async function JobDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const job = await getJobDetail(resolvedParams.slug);
  
  if (!job) {
    notFound();
  }

  const companyName = typeof job.company === 'string' ? job.company : job.company.name;
  
  return (
    <div className="bg-zinc-50 min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/karir" 
            className="group inline-flex items-center text-sm font-semibold text-zinc-600 hover:text-primary transition-colors"
          >
            <IconArrowLeft />
            Kembali ke Daftar Lowongan
          </Link>
        </div>
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info (Left Col - 2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Block */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                
                {/* Logo Box */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-center font-bold text-2xl text-primary shadow-inner">
                  {typeof job.company !== 'string' && job.company.logo ? (
                    <Image
                      src={urlFor(job.company.logo)?.url() || ''}
                      alt={companyName}
                      className="object-contain p-1"
                      fill
                    />
                  ) : (
                    <span>{companyName.charAt(0)}</span>
                  )}
                </div>
                
                {/* Title and Company */}
                <div className="flex-grow">
                  <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                    {job.title}
                  </h1>
                  <p className="mt-1.5 text-lg font-medium text-zinc-600">
                    {companyName}
                  </p>
                </div>
              </div>

              {/* Quick Tags row */}
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-zinc-100 pt-6">
                <span className="inline-flex items-center rounded-lg bg-red-50/80 px-3 py-1.5 text-xs font-semibold text-primary border border-red-100/50">
                  {job.jobType}
                </span>
                <span className="inline-flex items-center rounded-lg bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100/50">
                  {job.workplaceType}
                </span>
                {job.location && (
                  <span className="inline-flex items-center rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
                    {job.location}
                  </span>
                )}
                {job.fresh_graduate_friendly && (
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-100/30">
                    Fresh Graduate
                  </span>
                )}
              </div>
            </div>
            
            {/* Description Block */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-8">
              
              <div>
                <h2 className="text-xl font-bold text-zinc-900 flex items-center border-b border-zinc-100 pb-3">
                  Deskripsi Pekerjaan
                </h2>
                <div className="mt-4 text-zinc-700 leading-relaxed text-sm md:text-base space-y-4">
                  {typeof job.description === 'string' ? (
                    <div className="whitespace-pre-wrap">{job.description}</div>
                  ) : (
                    <div className="prose prose-zinc max-w-none">
                      <PortableText value={job.description} />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Responsibilities Block (if exists from Sanity) */}
              {job.responsibilities && (
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center border-b border-zinc-100 pb-3">
                    Tanggung Jawab
                  </h2>
                  <div className="mt-4 text-zinc-700 leading-relaxed text-sm md:text-base">
                    {typeof job.responsibilities === 'string' ? (
                      <div className="whitespace-pre-wrap">{job.responsibilities}</div>
                    ) : (
                      <div className="prose prose-zinc max-w-none">
                        <PortableText value={job.responsibilities} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Requirements / Persyaratan Block */}
              {(job.requirements || job.raw_requirements) && (
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center border-b border-zinc-100 pb-3">
                    Kualifikasi & Persyaratan
                  </h2>
                  <div className="mt-4 text-zinc-700 leading-relaxed text-sm md:text-base space-y-4">
                    {typeof job.requirements === 'string' ? (
                      <div className="whitespace-pre-wrap">{job.requirements}</div>
                    ) : (
                      <div className="prose prose-zinc max-w-none">
                        <PortableText value={job.requirements} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Information Card (Right Col - 1/3 width, sticky) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 mb-5">
                Ringkasan Pekerjaan
              </h3>
              
              <div className="space-y-4.5 text-sm">
                
                {/* Salary */}
                <div className="flex items-start">
                  <IconDollarSign />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Estimasi Gaji</p>
                    <p className="mt-0.5 font-bold text-zinc-900 text-base">
                      {job.salaryRange && job.salaryRange.isPublic !== false && (job.salaryRange.min || job.salaryRange.max) ? (
                        job.salaryRange.min && job.salaryRange.max ? (
                          `${formatIDRCurrency(job.salaryRange.min)} - ${formatIDRCurrency(job.salaryRange.max)}`
                        ) : job.salaryRange.min ? (
                          `Mulai dari ${formatIDRCurrency(job.salaryRange.min)}`
                        ) : (
                          `Hingga ${formatIDRCurrency(job.salaryRange.max)}`
                        )
                      ) : (
                        'Gaji tidak dipublikasikan'
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <IconMapPin />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Lokasi</p>
                    <p className="mt-0.5 font-bold text-zinc-900">
                      {job.location || 'Indonesia (Remote/Hybrid)'}
                    </p>
                  </div>
                </div>
                
                {/* Job Type */}
                <div className="flex items-start">
                  <IconBriefcase />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Jenis Pekerjaan</p>
                    <p className="mt-0.5 font-bold text-zinc-900">{job.jobType}</p>
                  </div>
                </div>
                
                {/* Education */}
                <div className="flex items-start">
                  <IconBookOpen />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Pendidikan Minimal</p>
                    <p className="mt-0.5 font-bold text-zinc-900">
                      {job.education_level || 'SMA / SMK / Sederajat'}
                      {job.education_is_mandatory && <span className="ml-1 text-xs text-red-500">(Wajib)</span>}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-start">
                  <IconBriefcase />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Pengalaman Minimal</p>
                    <p className="mt-0.5 font-bold text-zinc-900">
                      {job.min_experience_years !== undefined ? (
                        job.min_experience_years === 0 ? 'Tanpa Pengalaman (0 tahun)' : `${job.min_experience_years} tahun`
                      ) : (
                        'Tidak ditentukan'
                      )}
                      {job.experience_is_mandatory && <span className="ml-1 text-xs text-red-500">(Wajib)</span>}
                    </p>
                  </div>
                </div>
                
                {/* Posted Date */}
                <div className="flex items-start">
                  <IconCalendar />
                  <div>
                    <p className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Tanggal Publikasi</p>
                    <p className="mt-0.5 font-bold text-zinc-900">{formatDate(job.publishedAt)}</p>
                  </div>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="mt-6 space-y-3">
                {job.applyLink && (
                  <a 
                    href={job.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full"
                  >
                    <Button 
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center shadow-md shadow-red-100"
                    >
                      Lamar Sekarang
                      <IconExternalLink />
                    </Button>
                  </a>
                )}
                
                {job.contactEmail && (
                  <a 
                    href={`mailto:${job.contactEmail}?subject=Lamaran Pekerjaan: ${job.title}`}
                    className="block w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full h-11 border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold rounded-xl active:scale-[0.98] transition-all"
                    >
                      Kirim Email Kontak
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Poster Info if exists */}
            {job.postedBy && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Diposting Oleh</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-100 bg-zinc-50 flex items-center justify-center font-bold text-zinc-600 shadow-inner">
                    {job.postedBy.profileImageUrl ? (
                      <Image
                        src={job.postedBy.profileImageUrl}
                        alt={job.postedBy.name}
                        className="object-cover"
                        fill
                      />
                    ) : (
                      <span>{job.postedBy.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{job.postedBy.name}</p>
                    <p className="text-xs text-zinc-500">Alumni Partner</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
}