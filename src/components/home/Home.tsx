'use client';

import CommonButton from '../button/CommonButton';
import Header from './child/Header';
import Footer from './child/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col flex-grow justify-between w-full min-h-screen">
            <div className='mx-64 flex-grow h-full'>
                <Header />
                <div className='py-28'>
                    <div className='font-extrabold text-6xl mb-4 text-black'>
                        <div>모든 것을 기록하고, 정리하고,</div>
                        <div className='mt-1.5'>공유하세요</div>
                    </div>
                    <div className='text-xl mb-7'>
                        문서를 작성하고, 팀원들과 실시간으로 공유해보세요.
                    </div>
                    <div className='flex flex-row items-center gap-5 mb-20'>
                        <Link href="/signup">
                            <CommonButton
                                style={{
                                    width: 'w-52',
                                    height: 'h-[62px]',
                                    textSize: 'text-xl',
                                    textColor: 'text-white',
                                    bgColor: 'bg-black',
                                    hover: 'hover:scale-105'
                                }}
                                label="Workly 시작하기" />
                        </Link>
                        <Link href="/contact">
                            <CommonButton
                                style={{
                                    width: 'w-40',
                                    height: 'h-[62px]',
                                    textSize: 'text-xl',
                                    textColor: 'text-black',
                                    bgColor: 'bg-white',
                                    hover: 'hover:scale-105'
                                }}
                                label="문의 남기기" />
                        </Link>
                    </div>
                    <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
                        <Image src="/pngs/editor-home.png" alt="home-image" width={1000} height={1000} layout='responsive' />
                    </div>
                </div>
            </div>
            {/* 기존 Hero 섹션은 유지 */}

            {/* 주요 기능 소개 섹션 */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        하나의 워크스페이스에서 모든 것을 관리하세요
                    </h2>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">실시간 협업</h3>
                            <p className="text-gray-600">
                                팀원들과 실시간으로 문서를 편집하고 의견을 나눌 수 있습니다.
                                변경사항이 즉시 반영되어 효율적인 협업이 가능합니다.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">웹 페이지 게시</h3>
                            <p className="text-gray-600">
                                문서를 몇 번의 클릭만으로 웹 페이지로 변환하여 공유할 수 있습니다.
                                복잡한 설정 없이 전문적인 페이지를 만들어보세요.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">검색 & 즐겨찾기</h3>
                            <p className="text-gray-600">
                                강력한 검색 기능으로 필요한 정보를 빠르게 찾고,
                                자주 사용하는 문서는 즐겨찾기로 쉽게 접근하세요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 사용 사례 섹션 개선 */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        다양한 용도로 활용해보세요
                    </h2>

                    {/* 첫 번째 사례 */}
                    <div className="mb-24 flex items-center gap-16">
                        {/* <div className="flex-1">
                            <div className="relative">
                                <img
                                    src="/images/placeholder-1.jpg"
                                    alt="문서 관리"
                                    className="rounded-xl w-full h-[400px] object-cover shadow-lg"
                                />
                                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">실시간 협업중</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">3명이 편집중</span>
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                                            <div className="w-6 h-6 rounded-full bg-purple-400"></div>
                                            <div className="w-6 h-6 rounded-full bg-pink-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
                            <Image src="/pngs/collaboration.png" alt="team-document" width={700} height={700} />
                        </div>
                        <div className="flex-1 space-y-6">
                            <h3 className="text-3xl font-bold">실시간 협업</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                문서를 다른 사용자에게 공유하고, 함께 편집하세요.
                                텍스트, 이미지, 파일, 모든 것이 실시간으로 공유됩니다.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>실시간 문서 동기화</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>권한에 따른 편집 수준 관리</span>
                                </li>
                            </ul>
                            {/* 실시간 협업 관련 상태 버튼 */}
                            <div className="flex items-center gap-3 mt-6">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">실시간 동시 편집</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m0 0H6M4 12h2m12 0h2M12 4v1m0 14v1"></path>
                                    </svg>
                                    <span className="text-sm text-gray-600">실시간 공유</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 두 번째 사례 */}
                    <div className="flex items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-3xl font-bold">체계적인 문서 관리</h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                문서를 폴더별로 구조화하고, <br />문서의 상태에 따라서 체계적으로 관리할 수 있습니다.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>폴더 기반 문서 구조화</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>문서별 즐겨찾기 기능</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>마지막 열람 시간 표시</span>
                                </li>
                            </ul>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">마지막 열람 시간 표시</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-sm text-gray-600">즐겨찾기</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-[1.5]"> {/* flex-[1.5]로 이미지 영역 확장 */}
                            <div className='flex border border-gray-300 rounded-lg overflow-hidden shadow-lg'>
                                <Image
                                    src="/pngs/list.png"
                                    alt="document-list"
                                    width={1600}
                                    height={1600}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA 섹션 */}
            <section className="py-24 bg-black text-white">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-xl mb-8">
                        더 효율적인 협업과 문서 관리를 경험해보세요.
                    </p>
                    <Link href="/signup">
                        <CommonButton
                            style={{
                                width: 'w-52',
                                height: 'h-[62px]',
                                textSize: 'text-xl',
                                textColor: 'text-white',
                                bgColor: 'bg-black',
                                hover: 'hover:scale-105'
                            }}
                            label="지금 시작하기" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}