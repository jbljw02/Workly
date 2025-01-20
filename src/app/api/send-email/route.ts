import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'naver',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER,
            subject: `[Workly] 사용자 문의 메시지`,
            html: `
                <table style="margin: 40px 40px; width: 100%; max-width: 800px;" align="center;">
                <tbody>
                    <tr>
                        <td style="border-top: 2.5px solid #000000; height: 30px;"></td>
                        <td>
                            <svg style="position: relative; bottom: 17; left:8; width: 25px" xmlns="http://www.w3.org/2000/svg"
                                version="1.0" viewBox="0 0 1103.000000 1280.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="#000000"
                                    stroke-width="350">
                                    <path
                                        d="M3150 12793 c-854 -61 -1716 -430 -2251 -963 -58 -58 -133 -141 -168 -185 -657 -827 -898 -2265 -610 -3635 56 -268 75 -322 303 -890 117 -289 168 -476 235 -850 111 -619 167 -1389 143 -1965 -15 -382 -39 -473 -279 -1095 -250 -646 -311 -851 -332 -1112 -20 -246 26 -449 141 -615 89 -130 281 -299 473 -416 213 -129 893 -444 1226 -567 738 -273 1467 -420 2399 -481 256 -17 865 -17 1005 -1 557 65 1022 201 1288 376 177 116 227 221 247 516 15 216 27 344 60 670 61 607 98 819 186 1095 50 155 120 296 276 555 332 552 691 1085 1428 2115 431 604 623 876 845 1200 109 160 270 393 358 519 427 613 616 936 742 1274 189 507 217 1230 70 1813 -60 238 -149 451 -261 622 -81 124 -246 291 -384 389 -218 155 -506 265 -815 313 -142 22 -471 30 -635 16 -258 -23 -720 -118 -720 -148 0 -7 -12 -15 -27 -19 -16 -3 -35 -8 -43 -10 -11 -2 -23 18 -43 72 -37 98 -130 236 -210 311 -165 154 -377 239 -692 278 -116 15 -218 17 -600 16 -603 -2 -744 11 -990 89 -168 54 -284 105 -695 306 -479 234 -597 283 -820 339 -247 62 -574 88 -850 68z m445 -253 c330 -30 580 -94 880 -225 72 -32 185 -79 253 -106 223 -89 351 -161 445 -247 46 -44 60 -72 35 -72 -7 0 -56 -20 -109 -43 -647 -292 -1242 -1221 -1409 -2198 -34 -201 -66 -725 -57 -944 8 -205 42 -319 125 -416 30 -34 132 -113 138 -106 1 1 -4 56 -12 122 -21 174 -29 686 -15 870 42 538 139 970 306 1360 199 465 499 829 850 1032 79 46 248 120 345 151 668 214 1454 195 1969 -49 421 -199 628 -515 703 -1069 18 -133 15 -508 -6 -700 -32 -293 -102 -514 -248 -783 -102 -187 -159 -274 -458 -692 -216 -302 -301 -434 -393 -613 -90 -174 -93 -168 46 -111 314 129 687 582 978 1184 88 181 124 270 180 435 110 324 128 464 105 846 -29 481 -20 607 54 761 88 179 256 278 590 348 154 32 411 44 541 26 427 -61 757 -301 986 -716 126 -228 211 -493 262 -816 45 -283 54 -614 22 -784 -82 -429 -285 -973 -504 -1350 -58 -100 -627 -1015 -765 -1230 -362 -565 -631 -937 -962 -1335 -88 -104 -194 -236 -237 -293 -289 -383 -457 -563 -631 -678 -169 -112 -308 -112 -426 -1 -95 90 -99 188 -16 353 50 98 249 417 500 799 124 190 263 401 307 470 84 130 293 476 293 485 0 8 -120 -55 -169 -88 -109 -75 -236 -210 -343 -367 -36 -52 -139 -221 -228 -375 -233 -402 -313 -517 -464 -668 -88 -87 -199 -165 -283 -198 -82 -32 -252 -33 -373 -1 -225 60 -432 208 -519 372 -40 76 -52 135 -52 265 -1 254 81 525 272 904 89 176 97 195 81 207 -14 10 -22 7 -52 -16 -143 -113 -234 -274 -345 -610 -75 -228 -107 -309 -157 -393 -50 -86 -148 -186 -210 -215 -114 -53 -278 -47 -548 18 -91 22 -248 57 -350 79 -270 58 -393 105 -480 187 -91 85 -111 179 -103 481 10 348 -26 692 -109 1056 -29 125 -34 138 -52 135 -20 -3 -21 -7 -16 -138 10 -265 5 -783 -8 -900 -29 -256 -91 -442 -169 -510 -44 -39 -133 -81 -223 -105 -101 -26 -361 -32 -490 -10 -126 21 -236 56 -316 100 -63 35 -128 99 -144 139 -5 13 -29 264 -55 557 -25 294 -48 544 -51 557 -3 15 -12 22 -28 22 -26 0 -34 -20 -60 -150 -17 -88 -23 -159 -36 -455 -17 -360 -52 -478 -178 -596 -113 -107 -265 -171 -355 -150 -97 23 -142 89 -183 271 -11 48 -17 174 -24 490 -11 545 -29 669 -180 1260 -33 129 -72 281 -86 338 -25 95 -28 102 -48 96 -11 -4 -22 -7 -23 -8 -1 -1 11 -139 27 -306 97 -991 127 -1543 99 -1798 -12 -111 -42 -257 -65 -310 -17 -41 -51 -82 -69 -82 -49 0 -123 190 -175 449 -16 80 -45 274 -65 431 -62 495 -74 539 -379 1425 -48 138 -106 329 -130 425 -264 1057 -133 2235 349 3120 113 209 236 372 405 540 134 133 239 218 415 335 455 301 980 476 1580 528 93 8 398 6 500 -3z m-1090 -7370 c717 -21 1138 -60 1655 -150 777 -137 1425 -345 2012 -646 112 -57 311 -158 443 -223 364 -180 476 -249 590 -366 172 -176 166 -302 -32 -645 -89 -155 -117 -214 -151 -321 -130 -407 -209 -948 -231 -1577 -4 -128 -10 -235 -13 -238 -3 -3 -70 27 -148 66 -820 411 -1857 739 -2855 904 -1180 195 -2328 177 -3265 -53 l-75 -18 -4 21 c-5 33 18 189 51 336 37 163 91 336 210 660 188 512 230 648 280 910 16 87 21 172 28 485 9 408 13 440 67 551 64 132 241 235 480 280 188 35 406 40 958 24z m410 -3381 c1228 -67 2313 -337 3259 -810 218 -109 349 -193 420 -269 95 -101 51 -155 -209 -258 -847 -334 -1881 -313 -3111 62 -203 62 -801 262 -974 326 -355 131 -588 287 -662 445 -28 60 -30 73 -26 143 11 189 138 295 421 352 143 29 463 32 882 9z"
                                        class="jsx-398452aea2d0053e"></path>
                                    <path
                                        d="M3260 11804 c-130 -23 -259 -78 -367 -157 -361 -267 -669 -823 -724 -1307 -20 -182 3 -326 74 -445 l41 -70 17 139 c39 310 116 566 255 847 238 479 581 803 955 900 49 13 89 26 89 30 0 3 -39 18 -87 32 -85 26 -201 40 -253 31z"
                                        class="jsx-398452aea2d0053e"></path>
                                    <path
                                        d="M9220 10544 c0 -4 41 -110 90 -236 140 -353 184 -534 184 -758 0 -263 -41 -434 -209 -892 -77 -207 -155 -454 -155 -490 0 -7 39 26 86 72 230 228 386 588 445 1028 65 486 -35 910 -270 1142 -74 73 -171 149 -171 134z"
                                        class="jsx-398452aea2d0053e"></path>
                                </g>
                            </svg>
                        </td>
                    </tr>
                    <tr style="height: 30px">
                    </tr>
                    <tr>
                        <td style="font-size: 32px; font-weight:bold; text-align: left;">Workly 문의 메시지</td>
                    </tr>
                    <tr style="height: 20px;">
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #1E1E23;">Workly 사용자 ${name}님에게 온 메시지입니다.</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #1E1E23;">사용자의 아이디는 ${email}입니다.</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #e5e5e5; height: 50px;"></td>
                    </tr>
                    <tr>
                        <td style="height: 50px;"></td>
                    </tr>
                    <tr>
                        <th style="text-align: left; font-size: 16px">1. 이름</th>
                    </tr>
                    <tr>
                        <td style="font-size: 14px"> • ${name}</td>
                    </tr>
                    <tr style="height: 30px">
                    </tr>
                    <tr>
                        <th style="text-align: left; font-size: 16px">2. 메일</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-size: 14px"> • ${email}</td>
                    </tr>
                    <tr style="height: 30px">
                    </tr>
                    <tr>
                        <th style="text-align: left; font-size: 16px">3. 연락처</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-size: 14px"> • ${phone || '미입력'}</td>
                    </tr>
                    <tr style="height: 30px">
                    </tr>
                    <tr>
                        <th style="text-align: left; font-size: 15px">4. 문의내용</th>
                    </tr>
                    <tr>
                        <td style="text-align: left; font-size: 14px"> • ${message}</td>
                    </tr>
                </tbody>
            </table>
        `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '이메일 전송에 실패했습니다.' }, { status: 500 });
    }
} 