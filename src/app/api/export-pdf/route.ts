import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';


export async function POST(req: NextRequest) {
    try {
        const { content, title } = await req.json();

        if (!content) return NextResponse.json({ error: '문서 내용이 제공되지 않음' }, { status: 400 });
        if (!title) return NextResponse.json({ error: '문서명이 제공되지 않음' }, { status: 400 });

        const cssFilePath = path.join(process.cwd(), 'src/styles/pdfStyle.css');
        const editorStyles = fs.readFileSync(cssFilePath, 'utf-8');

        // 환경에 따라 다른 puppeteer 설정을 사용
        const isLocal = process.env.NEXT_PUBLIC_API_URL === 'http://localhost:3000';
        let puppeteer;
        let chromium;

        if (isLocal) {
            puppeteer = require('puppeteer');
        } else {
            puppeteer = require('puppeteer-core');
            chromium = require('@sparticuz/chromium');
        }

        const browser = await puppeteer.launch(
            isLocal ?
                { headless: 'new' } :
                {
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: chromium.headless,
                }
        );
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