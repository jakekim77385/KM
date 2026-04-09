import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('kkumi-auth', secret!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' }, { status: 401 });
}
