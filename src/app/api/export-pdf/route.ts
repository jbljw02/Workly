import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
    try {
        const { content, title } = await req.json();

        if (!content) return NextResponse.json({ error: '문서 내용이 제공되지 않음' }, { status: 400 });
        if (!title) return NextResponse.json({ error: '문서명이 제공되지 않음' }, { status: 400 });

        // CSS 파일 경로 설정하고 읽기
        const cssFilePath = path.join(process.cwd(), 'src/styles/pdfStyle.css');
        const editorStyles = fs.readFileSync(cssFilePath, 'utf-8');

        // Puppeteer를 이용해 가상 브라우저를 실행하고 새 페이지를 염
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 페이지 내용 설정 및 스타일 적용
        await page.setContent(`
            <html>
                <head>
                <style>
                    ${editorStyles}
                </style>
                </head>
                <body>
                    <h1 class="content-title">${title}</h1>
                    <div class="content">${content}</div>
                </body>
            </html>
        `);

        // PDF 생성
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        // Puppeteer 브라우저 종료
        await browser.close();

        // PDF 응답 생성
        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF 생성 실패: ", error);
        return NextResponse.json({ message: 'PDF 생성에 실패' }, { status: 500 });
    }
}