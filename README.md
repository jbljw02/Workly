# 실시간 문서 공동 작업 플랫폼 'Workly'
> Workly는 실시간 문서 공동 작업 플랫폼입니다. <br>
> 시중에 존재하는 많은 협업 도구들이 처음 접하는 사용자에겐 너무 다루기 어렵고, 높은 러닝 커브를 가지고 있습니다. Workly는 이 불편함으로부터 시작되었습니다. <br>
> 본 서비스는 누구나 쉽게 사용할 수 있는 문서 협업 플랫폼을 지향합니다. <br>
- 배포 URL: https://www.workly.kr

<br>

## 1. 프로젝트 개요

### 개발 기간
> 2024.06.30 - 진행중

### 인원 구성
> 이진우(1인)

### 기술

|Environment|Frontend|Backend|Database|Deployment|API|
|:---:|:---:|:---:|:---:|:---:|:---:|
|![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) |![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)|![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)|![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)|<img width="105" alt="tiptap" src="https://github.com/user-attachments/assets/1d336249-768a-4b6f-b133-88ef2bffd43d" />|

<br>

## 2. 프로젝트 구조도
![구조도](https://github.com/user-attachments/assets/7c88448d-5f38-4175-bab7-e541c8222c27)

## 3. 프로젝트 흐름도

### 1) 문서 내용 동기화 및 저장
![흐름도 - 문서 저장](https://github.com/user-attachments/assets/bc38adcd-4d7a-47f9-a3d7-a24c7d2620f5)

### 2) 문서 접근 제어
![흐름도 - 문서 접근](https://github.com/user-attachments/assets/ba37f5af-2b00-4742-b5ed-4fcd96e600a1)

### 3) 문서 조회: 주 저장소의 장애 상황을 대비한 이중화 구조
![흐름도 - 문서 조회](https://github.com/user-attachments/assets/631ddb2c-869e-4ff9-9e68-3933fd26b557)

### 4) 문서 내용 저장: 주 저장소의 용량 제한을 고려한 하이브리드 구조
![흐름도 - 문서 저장](https://github.com/user-attachments/assets/f0da602a-1608-4aca-b578-5ce5835f4f00)

<br>

## 4. 화면 구성 및 주요 기능

### 1) 홈 화면 및 체험 모드
- 홈 화면은 서비스에 대한 간단한 소개로 이루어져 있습니다.
- 회원가입 없이 체험 모드를 이용할 수 있습니다.
- 체험 모드에서는 데이터를 저장하지 DB에 저장하지 않으며, 일부 기능이 제한됩니다.

|홈 화면 및 체험 모드|
|:---:|
|![홈 화면 및 체험 모드](https://github.com/user-attachments/assets/58b64f39-bf5d-4b80-ac17-45c7e97c267e)|


### 2) 회원가입
- 유효성 검사(이메일과 비밀번호의 형식)를 통과해야 회원가입이 가능합니다.
- 중복된 이메일이 아니어야 합니다. 
- 이메일 인증을 완료해야 합니다.

|회원가입|
|:---:|
|![회원가입](https://github.com/user-attachments/assets/1158df4e-d77e-4dfd-b9b3-42239863929d)|

### 3) 로그인
- ID와 비밀번호가 일치하면 로그인에 성공하고, 메인 화면으로 이동합니다.
- 로그인 상태가 아니라면 메인 화면에 접근할 수 없습니다.
- 구글 계정을 통한 소셜 로그인이 가능합니다.

|로그인|
|:---:|
|![로그인](https://github.com/user-attachments/assets/b364e7ef-4aa6-4a5d-8b62-64ff252b53f4)|

|구글 로그인|
|:---:|
|![구글 로그인](https://github.com/user-attachments/assets/2c88b536-976d-4043-bd43-0df26f0e775e)|

### 4) 비밀번호 재생성
- 비밀번호를 분실할 경우 재생성 할 수 있습니다.

|비밀번호 재생성|
|:---:|
|![비밀번호 재생성](https://github.com/user-attachments/assets/adc0a129-9bef-4929-ad6d-aa84aa670c57)|

### 5) 메인 화면 
- 사용자가 작성중인 문서에 대한 미리보기를 제공합니다.
- 각 문서의 우측 하단에는 문서의 상태가 표시됩니다(즐겨찾기 여부, 게시 여부, 공유 여부).

|메인 화면|
|:---:|
|![메인 화면](https://github.com/user-attachments/assets/3fe7b135-9bef-48c6-8786-d1aa129eaf5c)|

### 6) 문서 탐색 및 관리
- 검색을 통해 문서를 찾을 수 있습니다.
- 폴더와 문서명을 변경하고, 생성 및 삭제 할 수 있습니다.
- 카테고리별로 문서를 관리합니다.
- 사이드바의 너비를 조절할 수 있습니다.

|문서 탐색 및 관리|
|:---:|
|![문서 탐색 및 관리](https://github.com/user-attachments/assets/135738ed-02f2-4bfb-a1eb-78a251cf55cc)|

### 7) 문서 작성 및 실시간 동시편집
- WYSIWYG 에디터를 이용해 문서를 작성할 수 있습니다.
- 다른 사용자에게 접근 권한을 부여하여, 문서를 실시간으로 동시 편집할 수 있습니다.
  
|문서 작성 및 실시간 동시 편집 (1)|
|:---:|
|![실시간 협업 - 1](https://github.com/user-attachments/assets/066a3d4e-66b0-4902-8c34-ef149e129972)|

|문서 작성 및 실시간 동시 편집 (2)|
|:---:|
|![실시간 협업 - 2](https://github.com/user-attachments/assets/0e837f04-9bfd-4a82-83c2-2628181bd142)|

### 8) 접근 권한 제어
- 문서의 관리자는 다른 사용자의 권한을 변경할 수 있습니다.
- 전체 허용: 다른 사용자의 권한을 변경하는 것을 제외, 관리자와 같은 수준의 권한을 가집니다.
- 쓰기 허용: 문서의 편집과 관련된 작업이 가능합니다. 사용자 초대, 삭제 등에 대한 권한은 없습니다.
- 읽기 허용: 문서를 열람할 수 있습니다.
- 변경된 권한은 실시간으로 반영됩니다. 사용자를 멤버에서 제거한다면 즉시 문서에 접근할 수 없게 됩니다.

|접근 권한 제어|
|:---:|
|![접근 권한 제어](https://github.com/user-attachments/assets/04b27856-f60d-4bbd-8aa8-ee992e9aa6be)|

### 9) 문서 게시
- 문서를 읽기 전용 웹 페이지로 변환할 수 있습니다.
- 변환된 페이지는 작성중인 문서와 독립적으로 관리되며, 모든 사람이 접근할 수 있습니다.

|문서 게시|
|:---:|
|![문서 게시](https://github.com/user-attachments/assets/c218fe2d-267f-4c55-bb5b-17ee41d7c152)|

### 10) 문서 작업 메뉴
- 문서를 다른 폴더로 옮길 수 있습니다.
- 문서의 사본을 만들 수 있습니다.
- 문서의 URL을 복사할 수 있습니다.
- 문서를 PDF 형식으로 다운로드 할 수 있습니다.
- 문서를 휴지통으로 이동시킬 수 있습니다.

|문서 작업 메뉴|
|:---:|
|![문서 옵션 작업](https://github.com/user-attachments/assets/53f56ef2-eeeb-4462-b13c-c0ab7e76b8b0)|

### 11) 휴지통
- 휴지통으로 문서 및 폴더를 관리할 수 있습니다.
- 문서/폴더를 복원 혹은 영구 삭제할 수 있습니다.
  
|휴지통|
|:---:|
|![휴지통](https://github.com/user-attachments/assets/0d863543-4129-4fcd-a494-5975012e38d7)|

### 12) 사용자 정보 변경
- 사용자의 프로필 이미지를 변경할 수 있습니다.
- 사용자명을 변경할 수 있습니다.
  
|사용자 정보 변경|
|:---:|
|![회원 정보 변경](https://github.com/user-attachments/assets/43453af7-8e61-46a3-a06e-cf429ae4b539)|

### 13) 문의
- 사용자는 서비스에 대한 문의사항을 접수할 수 있습니다.
- 작성된 내용은 이메일을 통해 관리자에게 전송됩니다.
  
|문의|
|:---:|
|![문의](https://github.com/user-attachments/assets/b4045864-f28e-412b-974c-6d4cada92fed)|
