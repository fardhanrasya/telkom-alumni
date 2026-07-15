'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Pagination from '@/components/Pagination';

// Interfaces for job listings
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  education_level?: string;
  education_is_mandatory?: boolean;
  min_experience_years?: number;
  experience_is_mandatory?: boolean;
  fresh_graduate_friendly?: boolean;
  is_internship?: boolean;
  job_type: string;
  description_summary?: string;
  raw_requirements?: string;
  postedAt: string;
  score?: number; // Semantic matching score
}

// Filter options constant
const jobTypes = [
  { value: 'Semua', label: 'Semua Tipe' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Kontrak' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Internship', label: 'Magang' }
];

// Helper SVGs for clean, dependencies-free modern icons
const IconSearch = () => (
  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconMapPin = () => (
  <svg className="h-4 w-4 text-zinc-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconBriefcase = () => (
  <svg className="h-4 w-4 text-zinc-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconDollar = () => (
  <svg className="h-4 w-4 text-zinc-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconAcademic = () => (
  <svg className="h-4 w-4 text-zinc-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconClock = () => (
  <svg className="h-4 w-4 text-zinc-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSparkles = () => (
  <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconCross = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCpu = () => (
  <svg className="h-10 w-10 text-primary mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const KarirContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters from URL
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const jobTypeParam = searchParams.get('jobType');
  const locationParam = searchParams.get('location');

  // Active Tab state: 'list' (Daftar Lowongan) or 'ai' (Asisten AI Resume)
  const [activeTab, setActiveTab] = useState<'list' | 'ai'>('list');

  // Standard search states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  // Filter form states
  const [searchTerm, setSearchTerm] = useState(searchParam || '');
  const [selectedJobType, setSelectedJobType] = useState(jobTypeParam || 'Semua');
  const [selectedLocation, setSelectedLocation] = useState(locationParam || '');

  // AI Resume Matcher states
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [aiLocation, setAiLocation] = useState('');
  const [aiJobs, setAiJobs] = useState<Job[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSearched, setAiSearched] = useState(false);

  // Fetch jobs using standard filters
  const fetchJobs = async (
    page: number, 
    filters: { search?: string; jobType?: string; location?: string }
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', itemsPerPage.toString());

      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.jobType && filters.jobType !== 'Semua') {
        queryParams.append('jobType', filters.jobType);
      }
      if (filters.location) {
        queryParams.append('location', filters.location);
      }

      const response = await fetch(`/api/karir?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data lowongan');
      }

      const result = await response.json();
      setJobs(result.jobs || []);
      setTotalPages(result.totalPages || 1);
      setTotalItems(result.totalItems || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL parameter changes
  useEffect(() => {
    if (activeTab === 'list') {
      const page = pageParam ? parseInt(pageParam) : 1;
      setCurrentPage(page);
      setSearchTerm(searchParam || '');
      setSelectedJobType(jobTypeParam || 'Semua');
      setSelectedLocation(locationParam || '');
      
      fetchJobs(page, {
        search: searchParam || undefined,
        jobType: jobTypeParam || undefined,
        location: locationParam || undefined,
      });
    }
  }, [pageParam, searchParam, jobTypeParam, locationParam, activeTab]);

  // Update URL params helper
  const updateURL = (page: number, search?: string, jobType?: string, location?: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search && search.trim() !== '') params.set('search', search);
    if (jobType && jobType !== 'Semua') params.set('jobType', jobType);
    if (location && location.trim() !== '') params.set('location', location);

    const qs = params.toString();
    router.replace(`/karir${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  // Handlers for standard search
  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateURL(1, searchTerm, selectedJobType, selectedLocation);
    fetchJobs(1, { search: searchTerm, jobType: selectedJobType, location: selectedLocation });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedJobType('Semua');
    setSelectedLocation('');
    setCurrentPage(1);
    router.replace('/karir', { scroll: false });
    fetchJobs(1, {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, searchTerm, selectedJobType, selectedLocation);
    fetchJobs(page, { search: searchTerm, jobType: selectedJobType, location: selectedLocation });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for AI Resume Search
  const handleAiMatching = async () => {
    if (!resumeFile && resumeText.trim().length < 20) {
      setAiError('Mohon masukkan deskripsi resume minimal 20 karakter atau upload file PDF.');
      return;
    }

    setAiLoading(true);
    setAiError('');
    setAiJobs([]);
    setAiSearched(true);

    try {
      let response;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        if (aiLocation) {
          formData.append('location', aiLocation);
        }
        formData.append('per_page', '6');

        response = await fetch('/api/karir/by-resume', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/karir/by-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: resumeText,
            location: aiLocation || undefined,
            per_page: 6,
          }),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Terjadi kesalahan saat mencocokkan resume.');
      }

      const result = await response.json();
      setAiJobs(result.jobs || []);
    } catch (err: any) {
      setAiError(err.message || 'Gagal terhubung ke asisten AI karir.');
    } finally {
      setAiLoading(false);
    }
  };

  // Salary Formatter Helper
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return '';
    const formatMil = (num: number) => {
      const val = num / 1000000;
      return `${val.toFixed(val % 1 === 0 ? 0 : 1)}Jt`;
    };
    if (min && max) return `Rp ${formatMil(min)} - ${formatMil(max)}`;
    if (min) return `Rp ${formatMil(min)}+`;
    return `Hingga Rp ${formatMil(max)}`;
  };

  // Job Type Badge styling helper
  const getJobTypeStyle = (type?: string) => {
    if (!type) return 'bg-zinc-50 text-zinc-600 border-zinc-200/60';
    const t = type.toLowerCase();
    if (t === 'full-time') return 'bg-red-50 text-primary border-red-100/50';
    if (t === 'internship' || t === 'magang') return 'bg-blue-50 text-blue-700 border-blue-100/50';
    if (t === 'part-time') return 'bg-amber-50 text-amber-700 border-amber-100/50';
    return 'bg-zinc-50 text-zinc-600 border-zinc-200/60';
  };

  return (
    <div className="bg-zinc-50 py-10 md:py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="mb-10 text-center space-y-4">
          <span className="inline-block text-xs font-bold text-primary tracking-widest uppercase bg-red-50 border border-red-100 rounded-full px-3 py-1">
            Portal Lowongan Karir
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Temukan Peluang <span className="underline decoration-primary decoration-4 underline-offset-4">Terbaik</span> Anda
          </h1>
          <p className="text-zinc-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Eksplorasi ribuan lowongan pekerjaan terkurasi untuk alumni SMK Telkom. Gunakan filter pintar atau biarkan kecerdasan AI mencocokkan CV Anda secara instan.
          </p>
        </div>

        {/* Custom Tab Selector */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-xl bg-zinc-200/60 p-1 border border-zinc-200/30">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-bold tracking-tight transition-all active:scale-[0.98] ${
                activeTab === 'list'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Daftar Lowongan
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-bold tracking-tight transition-all active:scale-[0.98] ${
                activeTab === 'ai'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <IconSparkles />
              Rekomendasi AI CV
            </button>
          </div>
        </div>

        {/* Tab 1: Standard Directory List */}
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                  Filter Lowongan
                </h3>
                {(searchTerm || selectedJobType !== 'Semua' || selectedLocation) && (
                  <button 
                    onClick={handleResetFilters} 
                    className="text-xs font-semibold text-zinc-400 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label htmlFor="search" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Kata Kunci
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IconSearch />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                    placeholder="Judul, perusahaan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-1.5">
                <label htmlFor="location" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Lokasi
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IconMapPin />
                  </div>
                  <input
                    type="text"
                    id="location"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                    placeholder="Kota, wilayah..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  />
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Tipe Pekerjaan
                </label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type.value} className="flex items-center text-sm font-semibold text-zinc-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jobType"
                        value={type.value}
                        checked={selectedJobType === type.value}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="h-4 w-4 text-primary border-zinc-300 focus:ring-primary"
                      />
                      <span className="ml-2.5">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleApplyFilters} 
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-md shadow-red-100"
              >
                Terapkan Filter
              </Button>
            </div>

            {/* Job Listings Grid */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Stats Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60">
                <p className="text-sm font-semibold text-zinc-500">
                  Menampilkan <span className="font-bold text-zinc-950">{totalItems}</span> lowongan ditemukan
                </p>
              </div>

              {/* Cards or Loading skeletons */}
              {loading ? (
                // Modern Skeleton Loader
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-zinc-200"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-5 w-1/3 bg-zinc-200 rounded"></div>
                          <div className="h-4 w-1/4 bg-zinc-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-zinc-100 rounded-lg"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-20 bg-zinc-200 rounded-full"></div>
                        <div className="h-6 w-24 bg-zinc-200 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link key={job.id} href={`/karir/${job.id}`} className="block">
                      <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                        <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                          <div className="flex items-start gap-4">
                            
                            {/* Initials Placeholder or logo */}
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-center font-bold text-lg text-primary shadow-inner">
                              {job.company.charAt(0)}
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors leading-tight">
                                {job.title}
                              </h3>
                              <p className="text-sm font-semibold text-zinc-600">{job.company}</p>
                              
                              {/* Metadata Icons Row */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs font-semibold text-zinc-500">
                                {job.location && (
                                  <span className="flex items-center">
                                    <IconMapPin />
                                    {job.location}
                                  </span>
                                )}
                                {job.education_level && (
                                  <span className="flex items-center">
                                    <IconAcademic />
                                    {job.education_level}
                                  </span>
                                )}
                                {(job.salary_min || job.salary_max) && (
                                  <span className="flex items-center font-bold text-zinc-700">
                                    <IconDollar />
                                    {formatSalary(job.salary_min, job.salary_max)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right action block */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0">
                            <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold leading-none ${getJobTypeStyle(job.jobType)}`}>
                              {job.jobType === 'full-time' ? 'Full-time' : job.jobType === 'internship' ? 'Magang' : job.jobType === 'part-time' ? 'Part-time' : job.jobType === 'contract' ? 'Kontrak' : job.jobType === 'freelance' ? 'Freelance' : job.jobType}
                            </span>
                            
                            <div className="flex items-center text-xs text-zinc-400 font-medium">
                              <IconClock />
                              {job.postedAt}
                            </div>
                          </div>
                        </div>

                        {/* Brief Summary of description */}
                        {job.description_summary && (
                          <div className="mt-4 text-xs text-zinc-500 line-clamp-2 bg-zinc-50 p-2.5 rounded-lg leading-relaxed">
                            {job.description_summary}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="rounded-2xl border border-zinc-200 border-dashed bg-white py-16 text-center shadow-sm">
                  <IconCpu />
                  <h3 className="mt-3 text-lg font-bold text-zinc-900">Lowongan tidak ditemukan</h3>
                  <p className="mt-1.5 text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Kami tidak dapat menemukan lowongan dengan filter tersebut. Coba reset filter atau gunakan kata kunci lain.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleResetFilters} variant="outline" className="h-10 border-zinc-200 font-bold rounded-xl">
                      Reset Semua Filter
                    </Button>
                  </div>
                </div>
              )}

              {/* Pagination control */}
              {!loading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}

            </div>
          </div>
        )}

        {/* Tab 2: AI Resume Matcher */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            
            {/* AI Control Bento Box */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                  <IconSparkles />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">AI Job Recommendation</h2>
                  <p className="text-zinc-500 text-xs font-medium">Sistem pintar pencocokan lowongan bertenaga AI</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Resume Inputs (Text manual or PDF Upload side-by-side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: paste text area */}
                  <div className="space-y-1.5">
                    <label htmlFor="resume" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                      Detail Resume / Profil Anda (Ketik manual)
                    </label>
                    <textarea
                      id="resume"
                      rows={6}
                      disabled={!!resumeFile}
                      className={`block w-full p-4 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium leading-relaxed ${!!resumeFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Contoh: Saya lulusan SMK Telkom jurusan Rekayasa Perangkat Lunak (RPL). Menguasai JavaScript, React, Node.js, dan database PostgreSQL. Memiliki minat tinggi di bidang frontend engineering..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-zinc-400 font-semibold px-1">
                      <span>Minimal 20 karakter</span>
                      <span>{resumeText.length}/2000 karakter</span>
                    </div>
                  </div>
                  
                  {/* Right Column: PDF Upload box */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                      Atau Upload PDF CV/Resume Anda
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-zinc-50 relative group flex flex-col justify-center items-center h-[162px] border-zinc-200 ${resumeText.trim().length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {(!resumeText.trim().length) && (
                        <input
                          type="file"
                          accept=".pdf"
                          disabled={resumeText.trim().length > 0}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setResumeFile(file);
                              setResumeText(''); // clear text when uploading file
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                      )}
                      
                      {resumeFile ? (
                        <div className="space-y-3 z-10">
                          <svg className="h-10 w-10 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-zinc-800 line-clamp-1">{resumeFile.name}</p>
                            <p className="text-xs text-zinc-400 font-medium">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                            }}
                            className="text-xs font-bold text-zinc-500 hover:text-primary underline relative z-30"
                          >
                            Hapus File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 text-zinc-500">
                          <svg className="h-10 w-10 mx-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-sm font-semibold">
                            {resumeText.trim().length > 0 ? (
                              <span className="text-zinc-400">Gunakan kolom teks di samping</span>
                            ) : (
                              <>
                                <span className="text-primary hover:underline">Klik untuk upload</span> atau seret PDF
                              </>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 font-medium">Format PDF (Maks. 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location pref input */}
                <div className="space-y-1.5 max-w-sm">
                  <label htmlFor="ai-loc" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">
                    Preferensi Lokasi (Opsional)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IconMapPin />
                    </div>
                    <input
                      type="text"
                      id="ai-loc"
                      className="block w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                      placeholder="Jakarta, Bandung, Remote..."
                      value={aiLocation}
                      onChange={(e) => setAiLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Trigger button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={handleAiMatching}
                    disabled={aiLoading}
                    className="h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl active:scale-[0.98] transition-transform px-6 shadow-md shadow-red-100 disabled:opacity-50 disabled:pointer-events-none flex items-center"
                  >
                    {aiLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menganalisis & Mencocokkan...
                      </>
                    ) : (
                      <>
                        <IconSparkles />
                        Temukan Peluang Sesuai Resume
                      </>
                    )}
                  </Button>
                </div>

                {/* Error toast if any */}
                {aiError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-4 mt-3 flex items-start justify-between text-red-800 text-sm font-semibold">
                    <p>{aiError}</p>
                    <button onClick={() => setAiError('')} className="text-red-500 hover:text-red-700">
                      <IconCross />
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* AI Results Block */}
            {aiSearched && (
              <div className="space-y-5">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-base font-black text-zinc-900 uppercase tracking-wider flex items-center">
                    Hasil Rekomendasi Karir AI
                    <span className="ml-2.5 font-bold text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 lowercase normal-case">
                      {aiJobs.length} kecocokan
                    </span>
                  </h3>
                </div>

                {aiLoading ? (
                  /* Loading skeletons */
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-center flex-1">
                            <div className="h-10 w-10 bg-zinc-200 rounded-xl"></div>
                            <div className="h-5 w-1/3 bg-zinc-200 rounded"></div>
                          </div>
                          <div className="h-6 w-16 bg-zinc-200 rounded-full"></div>
                        </div>
                        <div className="h-16 bg-zinc-50 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : aiJobs.length > 0 ? (
                  <div className="space-y-4">
                    {aiJobs.map((job) => {
                      // Calculate match score percentage
                      const scorePct = job.score ? Math.round(job.score) : 85;
                      const getScoreColor = (score: number) => {
                        if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
                        if (score >= 75) return 'text-primary bg-red-50 border-red-100';
                        return 'text-zinc-600 bg-zinc-50 border-zinc-200';
                      };

                      return (
                        <Link key={job.id} href={`/karir/${job.id}`} className="block">
                          <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                            
                            {/* Score Tag in absolute position on top right */}
                            <div className={`absolute top-5 right-5 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${getScoreColor(scorePct)} shadow-sm`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                              {scorePct}% Match
                            </div>

                            <div className="flex items-start gap-4 pr-24">
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-center font-bold text-lg text-primary shadow-inner">
                                {job.company.charAt(0)}
                              </div>
                              
                              <div className="space-y-1">
                                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors leading-tight">
                                  {job.title}
                                </h3>
                                <p className="text-sm font-semibold text-zinc-600">{job.company}</p>
                                
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs font-semibold text-zinc-500">
                                  {job.location && (
                                    <span className="flex items-center">
                                      <IconMapPin />
                                      {job.location}
                                    </span>
                                  )}
                                  <span className="flex items-center">
                                    <IconBriefcase />
                                    {job.jobType === 'full-time' ? 'Full-time' : job.jobType === 'internship' ? 'Magang' : job.jobType}
                                  </span>
                                  {job.education_level && (
                                    <span className="flex items-center">
                                      <IconAcademic />
                                      {job.education_level}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Match reasoning snippet if available */}
                            {job.description_summary && (
                              <div className="mt-4 text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 p-3 rounded-lg leading-relaxed">
                                <span className="font-bold text-zinc-800 block mb-1">Mengapa lowongan ini cocok:</span>
                                {job.description_summary}
                              </div>
                            )}

                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-200 border-dashed bg-white py-16 text-center shadow-sm">
                    <IconCpu />
                    <h3 className="mt-3 text-lg font-bold text-zinc-900">Tidak ada kecocokan yang ditemukan</h3>
                    <p className="mt-1.5 text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                      AI tidak menemukan lowongan yang sesuai dengan kualifikasi resume Anda. Silakan ubah resume Anda atau berikan deskripsi yang lebih rinci.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const KarirPage = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-20 text-center font-bold text-zinc-500">
        Memuat Portal Karir Alumni...
      </div>
    }>
      <KarirContent />
    </Suspense>
  );
};

export default KarirPage;