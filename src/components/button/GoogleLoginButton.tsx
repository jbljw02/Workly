import GoogleIcon from '../../../public/svgs/google.svg';


export default function GoogleLoginButton() {

    return (
        <div className='flex w-full'>
            <button className='flex items-center justify-center py-2.5 gap-1 rounded-lg border border-gray-400 w-full'>
                <GoogleIcon />
                <div>구글 계정으로 로그인</div>
            </button>
        </div>
    )
}