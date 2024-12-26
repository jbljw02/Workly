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

        const isLocal = process.env.NODE_ENV === 'development';
        let browser;

        if (isLocal) {
            const puppeteer = require('puppeteer');
            browser = await puppeteer.launch({
                headless: 'new'
            });
        } else {
            const puppeteer = require('puppeteer-core');
            const chromium = require('@sparticuz/chromium');

            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                ignoreHTTPSErrors: true
            });
        }

        const page = await browser.newPage();

        await page.setContent(`
            <html>
                <head>
                    <style>${editorStyles}</style>
                </head>
                <body>
                    <h1 class="content-title">${title}</h1>
                    <div class="content">${content}</div>
                </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF 생성 실패: ", error);
        return NextResponse.json({ error: 'PDF 생성에 실패했습니다.' }, { status: 500 });
    }
}